// pages/api/saveSurvey.ts
import type { NextApiRequest, NextApiResponse } from "next";
import prisma from "@/lib/prisma";

type Component2Response = {
  question: string;
  answer: string;
};

type TopicResponse = {
  component1: string;
  component2s: Component2Response[];
};

type SurveyRequestBody = {
  code: string;
  surveyId: number; // your survey identifier
  topics: TopicResponse[]; // array of 10 topics
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  try {
    const body: SurveyRequestBody = req.body;

    if (
      !body.code ||
      !body.surveyId ||
      !body.topics ||
      body.topics.length !== 10
    ) {
      return res.status(400).json({ message: "Invalid request body" });
    }

    // Check if survey already exists
    let survey = await prisma.survey.findUnique({
      where: { id: body.surveyId },
      include: { topics: { include: { component2s: true } } },
    });

    if (!survey) {
      // Create survey + topics + component2s
      survey = await prisma.survey.create({
        data: {
          id: body.surveyId,
          code: body.code,
          topics: {
            create: body.topics.map((topic, index) => ({
              topicIndex: index,
              component1: topic.component1,
              component2s: {
                create: topic.component2s,
              },
            })),
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
    } else {
      // Update existing survey (optional)
      for (let i = 0; i < body.topics.length; i++) {
        const topicResp = body.topics[i];
        const topic = survey.topics[i];

        // Update Component1
        await prisma.topic.update({
          where: { id: topic.id },
          data: { component1: topicResp.component1 },
        });

        // Update Component2 responses
        for (let j = 0; j < topicResp.component2s.length; j++) {
          const comp2Resp = topicResp.component2s[j];
          const comp2 = topic.component2s[j];
          await prisma.component2.update({
            where: { id: comp2.id },
            data: { answer: comp2Resp.answer },
          });
        }
      }
    }

    return res
      .status(200)
      .json({ message: "Survey saved successfully", survey });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server error", error });
  }
}
