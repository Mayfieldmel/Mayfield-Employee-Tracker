DROP TABLE IF EXISTS department;
CREATE TABLE department (
    id INTEGER AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(30) NOT NULL
);

DROP TABLE IF EXISTS role;
CREATE TABLE role(
    id INTEGER AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(30) NOT NULl,
    salary DECIMAL NOT NULL,
    department_id INTEGER,
    -- set to null on delete bc employee can be reassigned to new department if department is dissolved
    FOREIGN KEY (department_id) REFERENCES department(id) ON DELETE SET NULL
);

DROP TABLE IF EXISTS employee;
CREATE TABLE employee (
    id INTEGER AUTO_INCREMENT PRIMARY KEY,
    first_name VARCHAR(30) NOT NULL,
    last_name VARCHAR(30) NOT NULL,
    role_id INTEGER,
    manager_id INTEGER,
     -- set to null on delete bc employee can be reassigned if role is dissolved or manaager is fired
    CONSTRAINT fk_erole FOREIGN KEY (role_id) REFERENCES role(id),
    CONSTRAINT fk_emanager FOREIGN KEY (manager_id) REFERENCES employee(id)
);

 