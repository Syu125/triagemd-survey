-- AlterTable
ALTER TABLE "ConsentForm" ADD COLUMN     "agreed" BOOLEAN NOT NULL DEFAULT false,
ALTER COLUMN "participantName" DROP NOT NULL,
ALTER COLUMN "signatureData" DROP NOT NULL;
