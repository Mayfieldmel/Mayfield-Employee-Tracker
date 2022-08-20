// Import and require mysql2
const inquirer = require("inquirer");
const mysql = require("mysql2");
const { listenerCount } = require("./db/connection");
const db = require("./db/connection");
const questions = require("./lib/questions");

// const promptUser = require("./lib/questions");
require("console.table");

// initialize app
startApp();
promptUser();

function startApp() {
  console.log ('-------------------------');
  console.log ('Mayfield Employee Tracker');
  console.log ('-------------------------');
};   

var newRole = {};

// initial prompt
function promptUser() {
    inquirer
        .prompt(questions.promptUser)
        .then(({ choice }) => {
          if (choice == "View All Departments") {
            db.query(`SELECT * FROM department`, (err, results) => {
              if (err) {
                console.log(err);
              }
              console.table(results);
              return promptUser();
            })
          }
          if (choice == "View All Roles") {
            const sql = `SELECT role.id, role.title, department.name AS department, role.salary 
                         FROM role
                         LEFT JOIN department ON role.department_id = department.id`
            db.query(sql, (err, results) => {
              if (err) {
                console.log(err);
              }
              console.table(results);
              promptUser();
            })
          }
          if (choice == "View All Employees") {
            
            db.query(`SELECT * FROM employee`, (err, results) => {
              if (err) {
                console.log(err);
              }
              console.table(results);
              promptUser();
            })
          }
          if (choice == "Add a Department") {
            inquirer
              .prompt(questions.promptAddDepartment)
              .then(input => {
                const sql = `INSERT INTO department (name) VALUES (?)`;
                db.query(sql, input.name, (err, results) => {
                  if (err) {
                    console.log(err);
                  }
                  console.log(`Added ${input.name} to database`)
                  return promptUser();
                })
              })
          }
          if (choice == "Add a Role") {
            addRole();
           
            // console.log("new role:" + newRole);
            
            // const sql = `INSERT INTO role (title, salary, department_id) VALUES (?,?,?)`;
            // const params = 
            //   db.query(sql, [newRole], (err, results) => {
            //     if (err) {
            //       console.log(err);
            //     }
            //     console.log(`Added role to database`)
            //     return promptUser();
            //   })
          
          }
          if (choice == "Add an Employee") {

          }
          if (choice == "Update an Employee Role") {

          }
          if (choice == "Quit") {
            process.exit();
          }
        });
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

// db.query(`SELECT * FROM department`, (err, results) => {
          //         if (err) {
          //           console.log(err);
          //         }
          //         const rolesArr = results.map((results) => {
          //           const {name} = results;
          //           return `${name}`;       
          //       })
          //         console.log(rolesArr)
                 
                // inquirer
                //   .prompt({
                //     type: "list",
                //     name: "roles",
                //     message: "Which department does the role belong to?",
                //     choices: rolesArr
                //   })
                //   .then((choice) => {
                //     console.log(choice)
                //     newRole.department_id = choice;
                //     console.log(newRole)
                    
                    // const sql = `INSERT INTO role (title, department_id) VALUES (?)`;
                    // db.query(sql, input.name, (err, results) => {
                    //   if (err) {
                    //     console.log(err);
                    //   }
                    //   console.log(`Added ${input.name} to database`)
                    //   return promptUser();
                    // })



// function deleteEmployee() {
//   db.query("SELECT * FROM employee", function (err, results) {
//     const choices = results.map(({ id, first_name, last_name }) => {
//       return {
//         name: `${first_name} ${last_name}`,
//         value: id,
//       };
//     });

//     inquirer
//       .prompt([
//         {
//           type: "list",
//           name: "employeeId",
//           message: "Which employee would you like to remove?",
//           choices: choices,
//         },
//       ])
//       .then(({ employeeId }) => {
//         db.query(
//           `DELETE FROM employee WHERE id = ?`,
//           employeeId,
//           (err, result) => {
//             if (err) {
//               console.log(err);
//             }
//             console.log(result);
//             showOptions();
//           }
//         );
//       });
//   });
// }

// // Query database
// function showEmployees() {
//   db.query("SELECT * FROM employee", function (err, results) {
//     console.table(results);
//     showOptions();
//   });
// }


// check database connection
// db.connect(err => {
//   if (err) throw err;
//   console.log(`Connected to the employee database.`);
// });

