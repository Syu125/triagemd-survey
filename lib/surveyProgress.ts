import prisma from "@/lib/prisma";
import { Prisma } from "@prisma/client";

const TOPIC_COUNT = 10;

type SurveyWithTopics = Prisma.SurveyGetPayload<{
  include: {
    topics: {
      include: {
        component2s: true;
      };
    };
  };
}>;

type SurveyProgress = {
  hasProgress: boolean;
  surveyState: SurveyState;
  currentIndex: number;
  currentTopic: number;
};

const createEmptySurveyState = (code: string): SurveyState => ({
  code,
  surveyId: 1,
  topics: Array.from({ length: TOPIC_COUNT }, () => ({
    component1: null,
    component2: [],
  })),
});

const sortAnswers = <T extends { question: string }>(answers: T[]) => {
  return [...answers].sort((left, right) => {
    const leftIndex = Number(left.question);
    const rightIndex = Number(right.question);

    if (Number.isNaN(leftIndex) || Number.isNaN(rightIndex)) {
      return left.question.localeCompare(right.question);
    }

    return leftIndex - rightIndex;
  });
};

const inferCurrentIndex = (topics: SurveyState["topics"]) => {
  for (let index = 0; index < topics.length; index += 1) {
    const topic = topics[index];
    if (!topic.component1 || topic.component2.length === 0) {
      return index;
    }
  }

  return Math.max(0, topics.length - 1);
};

const normalizeTopics = (survey: SurveyWithTopics | null) => {
  return Array.from({ length: TOPIC_COUNT }, (_, index) => {
    const topic = survey?.topics.find((item) => item.topicIndex === index);
    return {
      component1: topic?.component1 ?? null,
      component2: topic
        ? sortAnswers(topic.component2s).map((component2) => ({
            question: component2.question,
            answer: component2.answer,
          }))
        : [],
    };
  });
};

const serializeTopics = (topics: SurveyState["topics"]) => {
  return topics.map((topic, index) => ({
    topicIndex: index,
    component1: topic.component1 ?? null,
    component2s: {
      create: topic.component2.map((component2) => ({
        question: component2.question,
        answer: component2.answer ?? "",
      })),
    },
  }));
};

export async function getLatestSurveyProgress(code: string): Promise<SurveyProgress> {
  const survey = await prisma.survey.findFirst({
    where: { code },
    orderBy: { createdAt: "desc" },
    include: {
      topics: {
        include: {
          component2s: true,
        },
      },
    },
  });

  if (!survey) {
    return {
      hasProgress: false,
      surveyState: createEmptySurveyState(code),
      currentIndex: 0,
      currentTopic: 0,
    };
  }

  const topics = normalizeTopics(survey);
  const currentIndex = inferCurrentIndex(topics);

  return {
    hasProgress: true,
    surveyState: {
      code,
      surveyId: survey.id,
      topics,
    },
    currentIndex,
    currentTopic: currentIndex,
  };
}

export async function upsertSurveyProgress(data: SurveyState) {
  return prisma.$transaction(async (tx) => {
    // Serialize writes per access code to avoid duplicate survey rows during concurrent autosaves.
    await tx.$executeRaw`SELECT pg_advisory_xact_lock(hashtext(${data.code}))`;

    const existingSurvey = await tx.survey.findFirst({
      where: { code: data.code },
      orderBy: { createdAt: "desc" },
      include: {
        topics: {
          include: {
            component2s: true,
          },
        },
      },
    });

    const topics = serializeTopics(data.topics);

    if (!existingSurvey) {
      return tx.survey.create({
        data: {
          code: data.code,
          topics: {
            create: topics,
          },
        },
        include: {
          topics: {
            include: {
              component2s: true,
            },
          },
        },
      });
    }

    const expectedTopicIndexes = new Set(
      data.topics.map((_, topicIndex) => topicIndex),
    );

    const existingTopicsByIndex = new Map(
      existingSurvey.topics.map((topic) => [topic.topicIndex, topic]),
    );

    for (let topicIndex = 0; topicIndex < data.topics.length; topicIndex += 1) {
      const incomingTopic = data.topics[topicIndex];
      const existingTopic = existingTopicsByIndex.get(topicIndex);

      if (!existingTopic) {
        await tx.topic.create({
          data: {
            surveyId: existingSurvey.id,
            topicIndex,
            component1: incomingTopic.component1 ?? null,
            component2s: {
              create: incomingTopic.component2.map((component2) => ({
                question: component2.question,
                answer: component2.answer ?? "",
              })),
            },
          },
        });
        continue;
      }

      await tx.topic.update({
        where: { id: existingTopic.id },
        data: {
          component1: incomingTopic.component1 ?? null,
        },
      });

      const incomingAnswersByQuestion = new Map(
        incomingTopic.component2.map((component2) => [
          component2.question,
          component2.answer ?? "",
        ]),
      );

      const existingAnswersByQuestion = new Map(
        existingTopic.component2s.map((component2) => [component2.question, component2]),
      );

      for (const [question, answer] of incomingAnswersByQuestion.entries()) {
        const existingAnswer = existingAnswersByQuestion.get(question);
        if (!existingAnswer) {
          await tx.component2.create({
            data: {
              topicId: existingTopic.id,
              question,
              answer,
            },
          });
          continue;
        }

        if (existingAnswer.answer !== answer) {
          await tx.component2.update({
            where: { id: existingAnswer.id },
            data: { answer },
          });
        }
      }

      const staleAnswerIds = existingTopic.component2s
        .filter((component2) => !incomingAnswersByQuestion.has(component2.question))
        .map((component2) => component2.id);

      if (staleAnswerIds.length > 0) {
        await tx.component2.deleteMany({
          where: {
            id: {
              in: staleAnswerIds,
            },
          },
        });
      }
    }

    const staleTopicIds = existingSurvey.topics
      .filter((topic) => !expectedTopicIndexes.has(topic.topicIndex))
      .map((topic) => topic.id);

    if (staleTopicIds.length > 0) {
      await tx.component2.deleteMany({
        where: {
          topicId: {
            in: staleTopicIds,
          },
        },
      });

      await tx.topic.deleteMany({
        where: {
          id: {
            in: staleTopicIds,
          },
        },
      });
    }

    return tx.survey.findUniqueOrThrow({
      where: { id: existingSurvey.id },
      include: {
        topics: {
          include: {
            component2s: true,
          },
        },
      },
    });
  }, {
    maxWait: 10000,
    timeout: 20000,
  });
}