ALTER TABLE "Player"
ADD COLUMN "privacyPolicyAcknowledgedAt" TIMESTAMP(3),
ADD COLUMN "privacyPolicyVersion" TEXT,
ADD COLUMN "termsOfUseAcceptedAt" TIMESTAMP(3),
ADD COLUMN "termsOfUseVersion" TEXT;
