"use server";

import prisma from "@/lib/prisma";

export async function saveSurvey(data: SurveyState) {
  try {
    const result = await prisma.survey.create({
      data: {
        code: data.code,
        // Map over the topics array to create nested records
        topics: {
          create: data.topics.map((topic, index) => ({
            topicIndex: index, // Use the array index as the topicIndex (0-9)
            component1: topic.component1 ?? null, // Ensure undefined becomes null

            // Nested write for Component2s
            component2s: {
              create: topic.component2
                // OPTIONAL: Filter out questions with no answers if you don't want to save them
                // .filter(c => c.answer)
                .map((c) => ({
                  question: c.question,
                  // Schema requires a String, but input allows null.
                  // Fallback to empty string "" if null/undefined.
                  answer: c.answer ?? "",
                })),
            },
          })),
        },
      },
      // Include the related data in the response if you need to return it
      include: {
        topics: {
          include: {
            component2s: true,
          },
        },
      },
    });

    return result;
  } catch (error) {
    console.error("Error saving survey:", error);
    throw error;
  }
}
