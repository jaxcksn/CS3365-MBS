DELETE FROM `Review`;

CREATE TABLE `MovieShowing`(
    `id` CHAR(9) NOT NULL,
    `title` VARCHAR(255) NOT NULL,
    `description` TEXT NOT NULL,
    `runtime` INT NOT NULL,
    `maturity_rating` VARCHAR(255) NOT NULL,
    `cast` TEXT NOT NULL,
    `release_date` DATE NOT NULL,
    `poster_url` TEXT NOT NULL,
    `start_date` DATE NOT NULL,
    `end_date` DATE NOT NULL,
    `times` JSON NOT NULL,
    `seat_price` DECIMAL(4, 2) NOT NULL,
    PRIMARY KEY(`id`)
);

INSERT INTO `MovieShowing` (`id`, `title`, `description`, `maturity_rating`, `runtime`, `cast`, `release_date`, `poster_url`, `start_date`, `end_date`, `times`, `seat_price`)
SELECT 
    `Movie`.`id`, 
    `Movie`.`title`, 
    `Movie`.`description`,
    'UNRATED',
    `Movie`.`runtime`, 
    `Movie`.`cast`, 
    `Movie`.`release_date`, 
    `Movie`.`poster_url`, 
    `Showing`.`start_date`, 
    `Showing`.`end_date`, 
    `Showing`.`times`, 
    `Showing`.`seat_price`
FROM `Showing`
JOIN `Movie` ON `Showing`.`movie` = `Movie`.`id`;

ALTER TABLE `Ticket` DROP FOREIGN KEY `ticket_showing_foreign`;
ALTER TABLE `Review` DROP FOREIGN KEY `review_movie_foreign`;
ALTER TABLE `Showing` DROP FOREIGN KEY `showing_movie_foreign`;


ALTER TABLE `Ticket` 
ADD CONSTRAINT `ticket_movieshowing_foreign` FOREIGN KEY (`showing`) REFERENCES `MovieShowing` (`id`);
ALTER TABLE `Review`
ADD CONSTRAINT `review_movieshowing_foreign` FOREIGN KEY (`movie`) REFERENCES `MovieShowing` (`id`);

DROP TABLE `Showing`;
DROP TABLE `Movie`;

