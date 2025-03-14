CREATE TABLE guardians (
    id VARCHAR(36) NOT NULL DEFAULT(uuid()),
    name VARCHAR(255) NOT NULL,
    cpf VARCHAR(11) NOT NULL UNIQUE,
    relationship VARCHAR(50) NOT NULL,
    isMain BOOLEAN NOT NULL,
    phone_number VARCHAR(11),

    PRIMARY KEY(id)
);