const inquirer = require("inquirer");
const mysql = require("mysql2");

const db = require("../db/connection");
const promiseDb = db.promise();
const promptUser = require("../app");
//  role table functions
//  view all roles in db
function getAllRoles() {
  const sql = `SELECT role.id, role.title, department.name AS department, CONCAT('$', FORMAT(role.salary, 0)) AS salary
    FROM role
    LEFT JOIN department ON role.department_id = department.id`
    return db.query(sql)
  }


// add role to db
function addRole() {
  db.query(`SELECT * FROM department`, (err, results) => {
    if (err) {
      console.log(err);
    }
    const departmentArr = results.map((results) => {
      const {name} = results;
      return `${name}`;       
  })
  return inquirer
  .prompt([
    {
        type: "input",
        name: "title",
        message: "What is the name of the role?",
    },
    {
        type: "input",
        name: "salary",
        message: "What is the salary of the role?",
    },
    {
      type: "list",
      name: "department",
      message: "Which department does the role belong to?",
      choices: departmentArr
    }
])
// take input and reformat
  .then((answers) => { 
    newRole.title = answers.title;
    newRole.salary = answers.salary;
    const sql = `SELECT * FROM department WHERE name = ?`;
    const params = [`${answers.department}`];
    db.query(sql, params, (err, results) => {
        if (err) {
          console.log(err);
        }
        newRole.department_id = results[0].id;
        const {title, salary, department_id} = newRole;
        // add reformated data to db
        const sql = `INSERT INTO role (title, salary, department_id) VALUES (?,?,?)`;
        const params = [title, salary, department_id]
          db.query(sql, params, (err, results) => {
            if (err) {
              console.log(err);
            }
            console.log('-------------------------------------');
            console.log(`Added ${title} to employees database`)
            console.log('-------------------------------------');
            return promptUser();
          })
    })
  })
})
}

module.exports = {getAllRoles, addRole};