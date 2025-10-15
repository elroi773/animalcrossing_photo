USE photos_db;

CREATE TABLE photos (
    id INT AUTO_INCREMENT PRIMARY KEY,
    url VARCHAR(255),
    created_at DATETIME
);