-- AlterTable
ALTER TABLE `receivedmailproperty` ADD COLUMN `spam` BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE `sendmailproperty` ADD COLUMN `spam` BOOLEAN NOT NULL DEFAULT false;
