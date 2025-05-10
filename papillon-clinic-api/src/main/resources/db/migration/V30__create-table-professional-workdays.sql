CREATE TABLE professional_workdays (
    id VARCHAR(36) NOT NULL DEFAULT(uuid()),
    professional_id VARCHAR(36) NOT NULL,
    workday_id VARCHAR(36) NOT NULL,
    shift_id VARCHAR(36) NOT NULL,

    PRIMARY KEY (id),
    FOREIGN KEY (professional_id) REFERENCES professionals(id),
    FOREIGN KEY (workday_id) REFERENCES workdays(id),
    FOREIGN KEY (shift_id) REFERENCES shifts(id)
);