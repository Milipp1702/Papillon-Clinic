CREATE TABLE appointment_frequency (
    id VARCHAR(36) NOT NULL DEFAULT(uuid()),
    end_date DATETIME,
    frequency VARCHAR(50) NOT NULL,
    frequency_interval INTEGER,
    emailReminder BOOLEAN,

    PRIMARY KEY(id)
);