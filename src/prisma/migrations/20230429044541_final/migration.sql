/*
  Warnings:

  - You are about to drop the column `read` on the `mail` table. All the data in the column will be lost.
  - Added the required column `senderEmail` to the `Mail` table without a default value. This is not possible if the table is not empty.
  - Added the required column `senderName` to the `Mail` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `mail` DROP COLUMN `read`,
    ADD COLUMN `senderEmail` VARCHAR(191) NOT NULL,
    ADD COLUMN `senderName` VARCHAR(191) NOT NULL;

-- AlterTable
ALTER TABLE `receivedmailproperty` ADD COLUMN `read` BOOLEAN NULL DEFAULT false;

-- AlterTable
ALTER TABLE `sendmailproperty` ADD COLUMN `read` BOOLEAN NULL DEFAULT false;
