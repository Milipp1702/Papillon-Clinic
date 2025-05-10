CREATE TABLE specialty_appointment_type (
    id VARCHAR(36) NOT NULL DEFAULT(uuid()),
    specialty_id VARCHAR(36),
    appointment_type_id VARCHAR(36),

    PRIMARY KEY(id),
    FOREIGN KEY(specialty_id) references specialties(id),
    FOREIGN KEY(appointment_type_id) references appointment_types(id)
);