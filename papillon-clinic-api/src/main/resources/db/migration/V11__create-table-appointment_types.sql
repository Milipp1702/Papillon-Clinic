CREATE TABLE appointment_types (
    id VARCHAR(36) NOT NULL DEFAULT(uuid()),
    name VARCHAR(255) NOT NULL,
    amount DECIMAL(6,2) NOT NULL,

    PRIMARY KEY(id)
);