-- CreateTable
CREATE TABLE "Echo" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "identityAnswer" TEXT,
    "completed" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Echo_pkey" PRIMARY KEY ("id")
);
