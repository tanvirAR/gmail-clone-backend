-- AlterTable
ALTER TABLE `receivedmailproperty` ADD COLUMN `scheduleSend` BOOLEAN NOT NULL DEFAULT false,
    ADD COLUMN `scheduleSendTime` BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE `sendmailproperty` ADD COLUMN `inbox` BOOLEAN NOT NULL DEFAULT true,
    ADD COLUMN `promotion` BOOLEAN NOT NULL DEFAULT false,
    ADD COLUMN `social` BOOLEAN NOT NULL DEFAULT false;
