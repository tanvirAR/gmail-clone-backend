/*
  Warnings:

  - You are about to drop the column `snoozed` on the `receivedmailproperty` table. All the data in the column will be lost.
  - You are about to drop the column `snoozed` on the `sendmailproperty` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `receivedmailproperty` DROP COLUMN `snoozed`,
    ADD COLUMN `snooze` BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE `sendmailproperty` DROP COLUMN `snoozed`;
