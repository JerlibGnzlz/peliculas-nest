-- CreateTable
CREATE TABLE "Movie" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "episodeId" INTEGER,
    "openingCrawl" TEXT,
    "director" TEXT,
    "producer" TEXT,
    "releaseDate" TIMESTAMP(3),
    "characters" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "planets" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "starships" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "vehicles" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "species" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "externalId" TEXT NOT NULL,

    CONSTRAINT "Movie_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Movie_externalId_key" ON "Movie"("externalId");
