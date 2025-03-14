CREATE TABLE addresses (
    id VARCHAR(36) NOT NULL DEFAULT(uuid()),
    street VARCHAR(255) NOT NULL,
    number INTEGER NOT NULL,
    city VARCHAR(100) NOT NULL,
    neighborhood VARCHAR(100) NOT NULL,
    complement VARCHAR(255),

    PRIMARY KEY(id)
);