CREATE TABLE users (
    id VARCHAR(36) NOT NULL DEFAULT(uuid()),
    login VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    role varchar(50) NOT NULL,

    PRIMARY KEY(id)
);