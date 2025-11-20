ALTER TABLE professionals ADD COLUMN active BOOLEAN DEFAULT TRUE,
RENAME COLUMN crm TO register_number;