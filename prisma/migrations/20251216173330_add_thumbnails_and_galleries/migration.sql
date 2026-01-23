-- AlterTable
ALTER TABLE "Activity" ADD COLUMN     "thumbnailId" TEXT;

-- AlterTable
ALTER TABLE "Experience" ADD COLUMN     "thumbnailId" TEXT;

-- AlterTable
ALTER TABLE "Media" ADD COLUMN     "projectGalleryId" TEXT,
ADD COLUMN     "researchGalleryId" TEXT;

-- AlterTable
ALTER TABLE "Project" ADD COLUMN     "thumbnailId" TEXT;

-- AlterTable
ALTER TABLE "Research" ADD COLUMN     "thumbnailId" TEXT;

-- AddForeignKey
ALTER TABLE "Project" ADD CONSTRAINT "Project_thumbnailId_fkey" FOREIGN KEY ("thumbnailId") REFERENCES "Media"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Research" ADD CONSTRAINT "Research_thumbnailId_fkey" FOREIGN KEY ("thumbnailId") REFERENCES "Media"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Experience" ADD CONSTRAINT "Experience_thumbnailId_fkey" FOREIGN KEY ("thumbnailId") REFERENCES "Media"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Activity" ADD CONSTRAINT "Activity_thumbnailId_fkey" FOREIGN KEY ("thumbnailId") REFERENCES "Media"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Media" ADD CONSTRAINT "Media_projectGalleryId_fkey" FOREIGN KEY ("projectGalleryId") REFERENCES "Project"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Media" ADD CONSTRAINT "Media_researchGalleryId_fkey" FOREIGN KEY ("researchGalleryId") REFERENCES "Research"("id") ON DELETE CASCADE ON UPDATE CASCADE;
