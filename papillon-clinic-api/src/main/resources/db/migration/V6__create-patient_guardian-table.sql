CREATE TABLE patients_guardians (
    id VARCHAR(36) NOT NULL DEFAULT(uuid()),
    patient_id VARCHAR(36),
    guardian_id VARCHAR(36),

    PRIMARY KEY(id),
    FOREIGN KEY(patient_id) references patients(id),
    FOREIGN KEY(guardian_id) references guardians(id)
);