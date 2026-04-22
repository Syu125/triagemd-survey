import { NextRequest, NextResponse } from "next/server";
import { getLatestSurveyProgress, upsertSurveyProgress } from "@/lib/surveyProgress";

export async function GET(request: NextRequest) {
  try {
    const accessCode = request.nextUrl.searchParams.get("accessCode")?.trim().toUpperCase();

    if (!accessCode) {
      return NextResponse.json(
        {
          error: "Missing required query parameter: accessCode",
        },
        { status: 400 },
      );
    }

    const progress = await getLatestSurveyProgress(accessCode);

    return NextResponse.json(progress);
  } catch (error) {
    console.error("Error loading survey progress:", error);

    const isDev = process.env.NODE_ENV !== "production";
    return NextResponse.json(
      {
        error: "Failed to load survey progress",
        ...(isDev && error instanceof Error ? { details: error.message } : {}),
      },
      { status: 500 },
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const surveyState = body?.surveyState as SurveyState | undefined;

    if (!surveyState?.code || !Array.isArray(surveyState.topics) || surveyState.topics.length !== 10) {
      return NextResponse.json(
        {
          error: "Invalid survey progress payload",
        },
        { status: 400 },
      );
    }

    const savedSurvey = await upsertSurveyProgress({
      ...surveyState,
      code: surveyState.code.trim().toUpperCase(),
    });

    return NextResponse.json({
      success: true,
      surveyId: savedSurvey.id,
    });
  } catch (error) {
    console.error("Error saving survey progress:", error);

    const isDev = process.env.NODE_ENV !== "production";
    return NextResponse.json(
      {
        error: "Failed to save survey progress",
        ...(isDev && error instanceof Error ? { details: error.message } : {}),
      },
      { status: 500 },
    );
  }
}