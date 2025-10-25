CREATE TABLE password_reset (
    id VARCHAR(36) NOT NULL DEFAULT(uuid()),
    token VARCHAR(100) NOT NULL,
    user_id VARCHAR(36) NOT NULL,
    expiration_date TIMESTAMP NOT NULL,

    PRIMARY KEY (id),
    FOREIGN KEY (user_id) REFERENCES users(id)
);
