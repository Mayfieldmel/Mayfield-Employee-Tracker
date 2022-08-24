const db = require("../db/connection");
const promiseDB = db.promise();
require("console.table");


// Read all roles from db
function getRoles() {
    const sql = `SELECT role.id, role.title, department.name AS department, CONCAT('$', FORMAT(role.salary, 0)) AS salary
    FROM role
    LEFT JOIN department ON role.department_id = department.id`
    return promiseDB.query(sql);
  }

// add role to db
function addRoleToDB(newRole) {
  const {title, salary, department_id} = newRole;
  const sql = `INSERT INTO role (title, salary, department_id) VALUES (?,?,?)`;
  const params = [title, salary, department_id]
  return promiseDB.query(sql, params);
  }

// get role id by title
function findRoleId(answers) {
  return promiseDB.query(`SELECT * FROM role WHERE title = ?`, answers.role)
  }


module.exports = {getRoles, findRoleId, addRoleToDB}