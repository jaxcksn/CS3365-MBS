-- Active: 1728346571669@@127.0.0.1@3306@mbs
CREATE TABLE IF NOT EXISTS `Showing`(
    `id` CHAR(36) NOT NULL,
    `movie` CHAR(36) NOT NULL,
    `times` JSON NOT NULL,
    `start_date` DATE NOT NULL,
    `end_date` DATE NOT NULL,
    `seat_price` DECIMAL(4, 2) NOT NULL,
    PRIMARY KEY(`id`)
);
CREATE TABLE  IF NOT EXISTS `Review`(
    `id` CHAR(36) NOT NULL,
    `rating` TINYINT NOT NULL,
    `text` TEXT NOT NULL,
    `created` TIMESTAMP NOT NULL,
    `user` CHAR(36) NOT NULL,
    `movie` CHAR(36) NOT NULL,
    PRIMARY KEY(`id`)
);
CREATE TABLE IF NOT EXISTS `Movie`(
    `id` CHAR(36) NOT NULL,
    `description` TEXT NOT NULL,
    `runtime` INT NOT NULL,
    `cast` TEXT NOT NULL,
    `release_date` DATE NOT NULL,
    `poster_url` TEXT NOT NULL,
    PRIMARY KEY(`id`)
);
CREATE TABLE IF NOT EXISTS `Refresh`(
    `id` INT NOT NULL AUTO_INCREMENT,
    `user` CHAR(36) NOT NULL,
    `token` CHAR(255) NOT NULL,
    `expires` TIMESTAMP NOT NULL,
    `revoked` BOOLEAN DEFAULT FALSE,
    `created` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY(`id`)
);
CREATE TABLE IF NOT EXISTS `Ticket`(
    `id` CHAR(36) NOT NULL,
    `showing` CHAR(36) NOT NULL,
    `user` CHAR(36) NOT NULL,
    `seats` INT NOT NULL,
    `date` DATE NOT NULL,
    `time` VARCHAR(255) NOT NULL,
    `theater` CHAR(36) NOT NULL,
    `transaction` CHAR(36) NOT NULL,
    PRIMARY KEY(`id`)
);
CREATE TABLE IF NOT EXISTS `App`(
    `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
    `version` VARCHAR(255) NOT NULL,
    `name` VARCHAR(255) NOT NULL
);
CREATE TABLE IF NOT EXISTS `Transaction`(
    `id` CHAR(36) NOT NULL,
    `amount` DECIMAL(4, 2) NOT NULL,
    `timestamp` TIMESTAMP NOT NULL,
    `method` VARCHAR(255) NOT NULL,
    PRIMARY KEY(`id`)
);
CREATE TABLE IF NOT EXISTS `User`(
    `id` CHAR(36) NOT NULL,
    `email` VARCHAR(255) NOT NULL UNIQUE,
    `password` VARCHAR(255) NOT NULL,
    `address` VARCHAR(255) NOT NULL,
    `zipcode` CHAR(5) NOT NULL,
    `state` CHAR(2) NOT NULL,
    `phone` VARCHAR(255) NOT NULL,
    `role` VARCHAR(255) NOT NULL,
    PRIMARY KEY(`id`)
);
CREATE TABLE IF NOT EXISTS `Theater`(
    `id` CHAR(36) NOT NULL,
    `name` VARCHAR(255) NOT NULL,
    PRIMARY KEY(`id`)
);


ALTER TABLE
    `Ticket` ADD CONSTRAINT `ticket_user_foreign` FOREIGN KEY(`user`) REFERENCES `User`(`id`) ON DELETE CASCADE;
ALTER TABLE
    `Review` ADD CONSTRAINT `review_movie_foreign` FOREIGN KEY(`movie`) REFERENCES `Movie`(`id`) ON DELETE CASCADE;
ALTER TABLE
    `Showing` ADD CONSTRAINT `showing_movie_foreign` FOREIGN KEY(`movie`) REFERENCES `Movie`(`id`) ON DELETE CASCADE;
ALTER TABLE
    `Refresh` ADD CONSTRAINT `refresh_user_foreign` FOREIGN KEY(`user`) REFERENCES `User`(`id`) ON DELETE CASCADE;
ALTER TABLE
    `Ticket` ADD CONSTRAINT `ticket_theater_foreign` FOREIGN KEY(`theater`) REFERENCES `Theater`(`id`);
ALTER TABLE
    `Ticket` ADD CONSTRAINT `ticket_transaction_foreign` FOREIGN KEY(`transaction`) REFERENCES `Transaction`(`id`);
ALTER TABLE
    `Ticket` ADD CONSTRAINT `ticket_showing_foreign` FOREIGN KEY(`showing`) REFERENCES `Showing`(`id`);

INSERT INTO `App`(`version`, `name`) VALUES ('0.0.1', 'Movie Booking System');
