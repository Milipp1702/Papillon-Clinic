CREATE TRIGGER beforeInsertOnPatitents BEFORE INSERT ON patients
FOR EACH ROW BEGIN
    SET new.created_at = now();
    SET new.updated_at = now();
END;