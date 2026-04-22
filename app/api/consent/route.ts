import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { Prisma } from "@prisma/client";

export async function GET(request: NextRequest) {
  try {
    const accessCode = request.nextUrl.searchParams.get("accessCode")?.trim();

    if (!accessCode) {
      return NextResponse.json(
        {
          error: "Missing required query parameter: accessCode",
        },
        { status: 400 },
      );
    }

    const records = await prisma.$queryRaw<{ id: number }[]>`
      SELECT "id"
      FROM "ConsentForm"
      WHERE "accessCode" = ${accessCode}
        AND "agreed" = ${true}
      ORDER BY "signedAt" DESC
      LIMIT 1
    `;

    return NextResponse.json({
      accessCode,
      hasConsented: records.length > 0,
    });
  } catch (error) {
    console.error("Error checking consent form status:", error);

    const isDev = process.env.NODE_ENV !== "production";
    return NextResponse.json(
      {
        error: "Failed to check consent form status",
        ...(isDev && error instanceof Error ? { details: error.message } : {}),
      },
      { status: 500 },
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const accessCode = body?.accessCode?.trim();
    const agreed = body?.agreed;

    if (!accessCode || agreed !== true) {
      return NextResponse.json(
        {
          error: "Missing required fields: accessCode and agreed=true",
        },
        { status: 400 }
      );
    }

    // Use raw SQL so this route is resilient even if Turbopack has a stale
    // generated Prisma model in memory during development.
    const inserted = await prisma.$queryRaw<{ accessCode: string | null }[]>`
      INSERT INTO "ConsentForm" ("accessCode", "agreed", "participantName", "signatureData")
      VALUES (${accessCode}, ${true}, ${"anonymous"}, ${"agreed-checkbox"})
      RETURNING "accessCode"
    `;

    const savedAccessCode = inserted[0]?.accessCode ?? accessCode;

    return NextResponse.json({
      success: true,
      accessCode: savedAccessCode,
      message: "Consent form signed and saved successfully",
    });
  } catch (error) {
    console.error("Error saving consent form:", error);

    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === "P2021"
    ) {
      return NextResponse.json(
        {
          error:
            "Database table for consent forms is missing. Run Prisma migrations and retry.",
        },
        { status: 500 }
      );
    }

    const isDev = process.env.NODE_ENV !== "production";
    return NextResponse.json(
      {
        error: "Failed to save consent form",
        ...(isDev && error instanceof Error ? { details: error.message } : {}),
      },
      { status: 500 }
    );
  }
}
