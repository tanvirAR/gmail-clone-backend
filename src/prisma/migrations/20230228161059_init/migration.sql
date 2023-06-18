-- CreateTable
CREATE TABLE `User` (
    `id` VARCHAR(191) NOT NULL,
    `firstName` VARCHAR(191) NOT NULL,
    `lastName` VARCHAR(191) NOT NULL,
    `email` VARCHAR(191) NULL,
    `password` VARCHAR(191) NOT NULL,
    `avatar` VARCHAR(191) NULL,
    `name` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `User_email_key`(`email`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Mail` (
    `id` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `senderId` VARCHAR(191) NOT NULL,
    `receiverId` VARCHAR(191) NOT NULL,
    `subject` VARCHAR(191) NULL,
    `message` VARCHAR(191) NULL,
    `attachment` VARCHAR(191) NULL,
    `read` BOOLEAN NULL DEFAULT false,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `sendMailProperty` (
    `id` VARCHAR(191) NOT NULL,
    `mailId` VARCHAR(191) NOT NULL,
    `deleted` BOOLEAN NOT NULL DEFAULT false,
    `trashBin` BOOLEAN NOT NULL DEFAULT false,
    `sent` BOOLEAN NOT NULL DEFAULT true,
    `starred` BOOLEAN NOT NULL DEFAULT false,
    `important` BOOLEAN NOT NULL DEFAULT false,
    `snoozed` JSON NOT NULL,
    `draft` BOOLEAN NOT NULL DEFAULT false,
    `scheduleSend` BOOLEAN NOT NULL DEFAULT false,
    `scheduleSendTime` BOOLEAN NOT NULL DEFAULT false,

    UNIQUE INDEX `sendMailProperty_mailId_key`(`mailId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `receivedMailProperty` (
    `id` VARCHAR(191) NOT NULL,
    `mailId` VARCHAR(191) NOT NULL,
    `inbox` BOOLEAN NOT NULL DEFAULT true,
    `social` BOOLEAN NOT NULL DEFAULT false,
    `promotion` BOOLEAN NOT NULL DEFAULT false,
    `deleted` BOOLEAN NOT NULL DEFAULT false,
    `trashBin` BOOLEAN NOT NULL DEFAULT false,
    `starred` BOOLEAN NOT NULL DEFAULT false,
    `important` BOOLEAN NOT NULL DEFAULT false,
    `snoozed` JSON NOT NULL,
    `draft` BOOLEAN NOT NULL DEFAULT false,

    UNIQUE INDEX `receivedMailProperty_mailId_key`(`mailId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `DraftEmails` (
    `id` VARCHAR(191) NOT NULL,
    `to` VARCHAR(191) NULL,
    `subject` VARCHAR(191) NULL,
    `message` VARCHAR(191) NULL,
    `userId` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `deletedMails` (
    `id` VARCHAR(191) NOT NULL,
    `userId` VARCHAR(191) NULL,
    `mailId` VARCHAR(191) NULL,
    `to` VARCHAR(191) NULL,
    `message` VARCHAR(191) NULL,
    `subject` VARCHAR(191) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Mail` ADD CONSTRAINT `Mail_senderId_fkey` FOREIGN KEY (`senderId`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Mail` ADD CONSTRAINT `Mail_receiverId_fkey` FOREIGN KEY (`receiverId`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `sendMailProperty` ADD CONSTRAINT `sendMailProperty_mailId_fkey` FOREIGN KEY (`mailId`) REFERENCES `Mail`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `receivedMailProperty` ADD CONSTRAINT `receivedMailProperty_mailId_fkey` FOREIGN KEY (`mailId`) REFERENCES `Mail`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `DraftEmails` ADD CONSTRAINT `DraftEmails_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `deletedMails` ADD CONSTRAINT `deletedMails_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `deletedMails` ADD CONSTRAINT `deletedMails_mailId_fkey` FOREIGN KEY (`mailId`) REFERENCES `Mail`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
