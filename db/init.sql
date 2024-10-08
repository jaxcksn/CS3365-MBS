CREATE DATABASE IF NOT EXISTS mbs;
use mbs;

CREATE TABLE IF NOT EXISTS appInfo(  
    id int NOT NULL PRIMARY KEY AUTO_INCREMENT COMMENT 'Primary Key',
    app_version VARCHAR(255) COMMENT 'App Version',
    app_name VARCHAR(255) COMMENT 'App Name'
);

INSERT INTO appInfo (id, app_version, app_name) VALUES (1, '0.0.1', 'Movie Booking System');