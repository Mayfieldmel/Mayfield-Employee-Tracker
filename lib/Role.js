// Import and require mysql2
const inquirer = require("inquirer");
const mysql = require("mysql2");

const db = require("../db/connection");
const { promptUser } = require("./questions");
const questions = require("./questions");


function showAllRoles(){
    const sql = `SELECT role.id, role.title, department.name AS department, role.salary 
    FROM role
    LEFT JOIN department ON role.department_id = department.id`
    db.query(sql, (err, results) => {
        if (err) {
        console.log(err);
        }
        console.table(results);
        promptUser()
    })
}

function addRole() {
    db.query(`SELECT * FROM department`, (err, results) => {
      if (err) {
        console.log(err);
      }
      const rolesArr = results.map((results) => {
        const {name} = results;
        return `${name}`;       
    })
    return inquirer
    .prompt(questions.promptAddRole)
    .then((input) => { 
    newRole.title = input.title;
    newRole.salary = input.salary;
      console.log(newRole);
    })
    .then(() => {
      return inquirer
    .prompt({
      type: "list",
      name: "department",
      message: "Which department does the role belong to?",
      choices: rolesArr
    })
    .then(choice => {
      console.log(choice);
      console.log(choice.department);
      const sql = `SELECT * FROM department WHERE name = ?`;
      const params = [`${choice.department}`];
      db.query(sql, params, (err, results) => {
          if (err) {
            console.log(err);
          }
          console.log(results[0].id);
          newRole.department_id = results[0].id;
          console.log(newRole);
          const {title, salary, department_id} = newRole;
          const sql = `INSERT INTO role (title, salary, department_id) VALUES (?,?,?)`;
          const params = [title, salary, department_id]
            db.query(sql, params, (err, results) => {
              if (err) {
                console.log(err);
              }
              console.log("new role:" + newRole)
              console.log(`Added role to database`)
              return promptUser();
            })
        })
      })
    })
  })
  
}

module.exports = {showAllRoles, addRole}