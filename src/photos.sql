CREATE DATABASE IF NOT EXISTS photos_db;
USE photos_db;

CREATE TABLE IF NOT EXISTS photos (
    id INT AUTO_INCREMENT PRIMARY KEY,
    url VARCHAR(255),
    character_name VARCHAR(100),
    created_at DATETIME
);