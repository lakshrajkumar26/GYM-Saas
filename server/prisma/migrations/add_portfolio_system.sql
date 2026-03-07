-- CreateTable
CREATE TABLE "Portfolio" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "content" TEXT,
    "type" TEXT NOT NULL,
    "section" TEXT,
    "mediaUrl" TEXT,
    "thumbnailUrl" TEXT,
    "isPublished" BOOLEAN NOT NULL DEFAULT false,
    "order" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Portfolio_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Portfolio_type_idx" ON "Portfolio"("type");

-- CreateIndex
CREATE INDEX "Portfolio_section_idx" ON "Portfolio"("section");

-- CreateIndex
CREATE INDEX "Portfolio_isPublished_idx" ON "Portfolio"("isPublished");
