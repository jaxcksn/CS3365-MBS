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
    `title` VARCHAR(255) NOT NULL,
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
    `city` VARCHAR(255) NOT NULL,
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

/*INSERT INTO `Movie` (`id`, `description`, `runtime`, `cast`, `release_date`, `poster_url`, `title`) VALUES ('','',139,'',DATE('2024-10-01'),'','');*/
INSERT INTO `Movie` (`id`, `description`, `runtime`, `cast`, `release_date`, `poster_url`, `title`) VALUES ('0708262a-7fe8-457f-9643-90dc81395e7b','After two decades as one of the most beloved and enduring musicals on the stage, Wicked makes its long-awaited journey to the big screen as a spectacular, generation-defining two-part cinematic event this holiday season.',160,'Cynthia Erivo, Ariana Grande, Jonathan Bailey',DATE('2024-11-22'),'https://m.media-amazon.com/images/M/MV5BMzE0NjU1NjctNTY5Mi00OGE2LWJkYjktZDI0MTNjN2RhNDMwXkEyXkFqcGc@._V1_.jpg','Wicked');
INSERT INTO `Movie` (`id`, `description`, `runtime`, `cast`, `release_date`, `poster_url`, `title`) VALUES ('b65b5a84-ff90-407d-bf5b-9fd9a1152b51','Struggling with his dual identity, failed comedian Arthur Fleck meets the love of his life, Harley Quinn, while incarcerated at Arkham State Hospital.',139,'Joaquin Phoenix, Lady Gaga, Brendan Gleeson',DATE('2024-10-01'),'https://www.movieposters.com/cdn/shop/files/scan_79e10e79-5be5-487d-a01a-bf6e899bdcae_480x.progressive.jpg?v=1715268834','Joker: Folie à Deux');
INSERT INTO `Movie` (`id`, `description`, `runtime`, `cast`, `release_date`, `poster_url`, `title`) VALUES ('d950a7f6-12c8-4e04-9727-9574024a91d3','After a shipwreck, an intelligent robot called Roz is stranded on an uninhabited island. To survive the harsh environment, Roz bonds with the island\'s animals and cares for an orphaned baby goose.',139,'Lupita Nyong\'o, Pedro Pascal, Kit Connor',DATE('2024-09-27'),'https://m.media-amazon.com/images/M/MV5BZjM2M2E3YzAtZDJjYy00MDhkLThiYmItOGZhNzQ3NTgyZmI0XkEyXkFqcGc@._V1_FMjpg_UY5000_.jpg','The Wild Robot');