USE `mbs`;

ALTER TABLE `Showing`
MODIFY COLUMN movie CHAR(9) UNIQUE NOT NULL;


INSERT INTO Showing(id,movie,seat_price,start_date,end_date,times) 
SELECT 
    '501nEOK16',
    id,
    10.99,
    DATE('2024-10-20'),
    DATE('2024-11-20'),
    '["9:00AM","10:00AM","2:00PM","5:00PM"]'
FROM Movie
WHERE Movie.id='pP9XD1sQ2';
