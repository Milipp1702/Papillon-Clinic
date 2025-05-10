CREATE TABLE shifts (
    id VARCHAR(36) NOT NULL DEFAULT(uuid()),
    shift VARCHAR(50) NOT NULL,
    start_time TIME NOT NULL,
    end_time TIME NOT NULL,

    PRIMARY KEY (id)
);