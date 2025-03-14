CREATE TABLE patients (
    id VARCHAR(36) NOT NULL DEFAULT(uuid()),
    name VARCHAR(255) NOT NULL,
    birthdate DATE NOT NULL,
    age INTEGER NOT NULL,
    address_id VARCHAR(36),
    created_at DATETIME NOT NULL,
    updated_at DATETIME,

    PRIMARY KEY(id),
    FOREIGN KEY(address_id) references addresses(id)
);