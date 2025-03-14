CREATE TABLE professionals (
    id VARCHAR(36) NOT NULL DEFAULT(uuid()),
    cpf VARCHAR(11) NOT NULL,
    crm VARCHAR(13) NOT NULL,
    specialty VARCHAR(50) NOT NULL,
    phone_number VARCHAR(11),
    discount DECIMAL(3,2),

    PRIMARY KEY(id)
);