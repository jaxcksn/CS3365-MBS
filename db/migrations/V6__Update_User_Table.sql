ALTER TABLE `User` ADD COLUMN `firstName` VARCHAR(255) NOT NULL DEFAULT 'First';
ALTER TABLE `User` ADD COLUMN `lastName` VARCHAR(255) NOT NULL DEFAULT 'Last';
ALTER TABLE `User` ADD COLUMN `address` TEXT;