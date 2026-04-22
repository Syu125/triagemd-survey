"use server";

import { upsertSurveyProgress } from "@/lib/surveyProgress";

export async function saveSurvey(data: SurveyState) {
  return upsertSurveyProgress(data);
}
