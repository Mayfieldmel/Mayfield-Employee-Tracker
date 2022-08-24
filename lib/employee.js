const db = require("../db/connection");
const promiseDB = db.promise();
require("console.table");

// get all employees from db
function getEmployees() {
    const sql = `SELECT e.id, e.first_name, e.last_name, role.title, department.name AS department, CONCAT('$', FORMAT(role.salary, 0)) AS salary, CONCAT(m.first_name, " ", m.last_name) AS manager
    FROM employee e
    LEFT JOIN role ON role_id = role.id
    LEFT JOIN department ON department_id = department.id
    LEFT JOIN employee m ON e.manager_id = m.id`;
    return promiseDB.query(sql)
}

// add new employee to db
function addEmployee(newEmployee) {
    const { first_name, last_name, role_id, manager_id } = newEmployee;
    const sql = `INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES (?,?,?,?)`;
    const params = [first_name, last_name, role_id, manager_id];
    return promiseDB.query(sql, params)
}

// find employee id from employee name
function findEmployeeId(manager) {
    const sql = `SELECT * FROM employee WHERE first_name = ? AND last_name = ?`;
    const params = manager.split(" ");
    db.query(sql, params)
}

module.exports = {getEmployees, addEmployee, findEmployeeId}