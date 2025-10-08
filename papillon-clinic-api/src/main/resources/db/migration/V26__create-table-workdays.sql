CREATE TABLE workdays (
    id VARCHAR(36) NOT NULL DEFAULT(uuid()),
    day VARCHAR(50) NOT NULL,

    PRIMARY KEY (id)
);