-- CreateTable
CREATE TABLE "ConsentForm" (
    "id" SERIAL NOT NULL,
    "participantName" TEXT NOT NULL,
    "participantEmail" TEXT,
    "signatureData" TEXT NOT NULL,
    "signedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ConsentForm_pkey" PRIMARY KEY ("id")
);
