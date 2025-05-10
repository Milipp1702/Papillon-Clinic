ALTER TABLE professionals
ADD CONSTRAINT fk_specialty
FOREIGN KEY (specialty) REFERENCES specialties(id);