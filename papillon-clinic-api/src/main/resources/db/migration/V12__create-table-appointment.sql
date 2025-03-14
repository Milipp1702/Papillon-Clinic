CREATE TABLE appointments (
    id VARCHAR(36) NOT NULL DEFAULT(uuid()),
    appointment_date DATE NOT NULL,
    patient_id VARCHAR(36) NOT NULL,
    appointment_type VARCHAR(36) NOT NULL,
    payment_type VARCHAR(50) NOT NULL,
    payment_date DATE,
    professional_id VARCHAR(36) NOT NULL,
    observation VARCHAR(255),

    PRIMARY KEY(id),
    FOREIGN KEY(patient_id) references patients(id),
    FOREIGN KEY(appointment_type) references appointment_types(id),
    FOREIGN KEY(professional_id) references professionals(id)
);