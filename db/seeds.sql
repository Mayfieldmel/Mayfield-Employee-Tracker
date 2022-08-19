INSERT INTO department (name)
VALUES 
    ("Sales"),
    ("Engineering"),
    ("Finance"),
    ("Legal");

INSERT INTO role (title, salary, department_id)
VALUES
    ("Salesperson", "80000", 1),
    ("Sales Manager", "100000", 1),
    ("Software Engineer", "120000", 2),
    ("Lead Engineer", "150000", 2),
    ("Accountant", "125000", 3),
    ("Account Manager", "160000", 3),
    ("Lawyer", "190000", 4),
    ("Legal Team Lead", "250000", 4);

INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES
    ("John", "Doe", 2, NULL),
    ("Mike", "Chan", 1, 1),
    ("Ashley", "Rodriguez", 4, NULL),
    ("Kevin", "Tupik", 3, 3),
    ("Kunal", "Singh", 6, NULL),
    ("Malia", "Brown", 5, 5),
    ("Sarah", "Lourd", 8, NULL),
    ("Tom", "Allen", 7, 7);
