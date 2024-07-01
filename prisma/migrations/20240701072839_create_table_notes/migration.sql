-- CreateTable
CREATE TABLE `notes` (
    `id` VARCHAR(100) NOT NULL,
    `title` VARCHAR(100) NOT NULL,
    `body` TEXT NOT NULL,
    `archived` BOOLEAN NOT NULL,
    `createdAt` VARCHAR(100) NOT NULL,
    `username` VARCHAR(100) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `notes` ADD CONSTRAINT `notes_username_fkey` FOREIGN KEY (`username`) REFERENCES `users`(`username`) ON DELETE RESTRICT ON UPDATE CASCADE;
