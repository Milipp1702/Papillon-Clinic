CREATE TABLE specialties (
    id VARCHAR(36) NOT NULL DEFAULT(uuid()),
    name VARCHAR(255) NOT NULL,

    PRIMARY KEY(id)
);