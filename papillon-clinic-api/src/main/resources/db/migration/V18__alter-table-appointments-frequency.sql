ALTER TABLE appointments
ADD COLUMN appointment_frequency_id VARCHAR(36),
ADD CONSTRAINT fk_appointment_frequency FOREIGN KEY (appointment_frequency_id)
REFERENCES appointment_frequency(id) ON DELETE CASCADE;