CREATE TABLE appointment_frequency (
    id VARCHAR(36) NOT NULL DEFAULT(uuid()),
    end_date DATETIME,
    frequency VARCHAR(50) NOT NULL,
    frequency_interval INTEGER,
    emailReminder BOOLEAN,
    appointment_id VARCHAR(36),

    PRIMARY KEY(id),
    FOREIGN KEY(appointment_id) references appointments(id)
);