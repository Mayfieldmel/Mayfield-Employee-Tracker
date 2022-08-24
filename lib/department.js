const db = require("../db/connection");
const promiseDB = db.promise();
require("console.table");

// Read all departments from db
function getDepartments() {
    return promiseDB.query(`SELECT * FROM department`)
  }

function addDepartment(input) {
    return promiseDB.query(`INSERT INTO department (name) VALUES (?)`, input.name)  
}

function findDepartmentId(department) {
    return promiseDB.query(`SELECT * FROM department WHERE name = ?`, department)
}


module.exports = {getDepartments, addDepartment, findDepartmentId}