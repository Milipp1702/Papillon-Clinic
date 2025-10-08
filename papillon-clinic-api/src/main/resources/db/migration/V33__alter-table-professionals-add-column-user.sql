ALTER TABLE professionals
ADD COLUMN user_id VARCHAR(255),
ADD CONSTRAINT fk_professional_user
FOREIGN KEY (user_id) REFERENCES users(id);