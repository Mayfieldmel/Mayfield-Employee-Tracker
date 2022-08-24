// Import and require mysql2
const inquirer = require("inquirer");
const mysql = require("mysql2");

const db = require("../db/connection");
const initialPrompt = require("./Prompt")
require("console.table");
const promiseDB = db.promise();

function showAllRoles(){
    const sql = `SELECT role.id, role.title, department.name AS department, role.salary 
    FROM role
    LEFT JOIN department ON role.department_id = department.id`
    return promiseDB.query(sql);
        
    
    
  }

//   function viewAllRoles() {
//     showAllRoles().then(([results]) => console.table(results))
//   }
// viewAllRoles()
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
    .then((answers) => { 
      newRole.title = answers.title;
      newRole.salary = answers.salary;
      console.log(newRole)
      const sql = `SELECT * FROM department WHERE name = ?`;
      const params = [`${answers.department}`];
      db.query(sql, params, (err, results) => {
          if (err) {
            console.log(err);
          }
          newRole.department_id = results[0].id;
          console.log(newRole)
          const {title, salary, department_id} = newRole;
          const sql = `INSERT INTO role (title, salary, department_id) VALUES (?,?,?)`;
          const params = [title, salary, department_id]
            db.query(sql, params, (err, results) => {
              if (err) {
                console.log(err);
              }
              console.log(`Added role to database`)
            //   return promptUser();
            })
      })
    })
  })
  }

  

module.exports = {showAllRoles, addRole}