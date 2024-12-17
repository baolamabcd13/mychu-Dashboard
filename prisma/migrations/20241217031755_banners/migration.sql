/*
  Warnings:

  - You are about to drop the column `description` on the `banners` table. All the data in the column will be lost.
  - You are about to drop the column `imageUrl` on the `banners` table. All the data in the column will be lost.
  - Added the required column `image` to the `banners` table without a default value. This is not possible if the table is not empty.
  - Added the required column `link` to the `banners` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "banners" DROP COLUMN "description",
DROP COLUMN "imageUrl",
ADD COLUMN     "image" TEXT NOT NULL,
ADD COLUMN     "link" TEXT NOT NULL;
