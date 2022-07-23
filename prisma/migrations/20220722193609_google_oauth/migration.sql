/*
  Warnings:

  - A unique constraint covering the columns `[orgEmail]` on the table `Volunteer` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE `volunteer` ADD COLUMN `googleOauthToken` TEXT NULL,
    ADD COLUMN `googleRefreshToken` TEXT NULL,
    MODIFY `orgEmail` VARCHAR(191) NULL;

-- CreateIndex
CREATE UNIQUE INDEX `Volunteer_orgEmail_key` ON `Volunteer`(`orgEmail`);
