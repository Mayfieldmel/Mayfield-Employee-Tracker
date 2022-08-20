// Import and require mysql2
const inquirer = require("inquirer");
const mysql = require("mysql2");

const db = require("./db/connection");
const questions = require("./lib/questions");
const roleLib = require("./lib/Role");

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
            showAllDepartments();
          }
          if (choice == "View All Roles") {
            showAllRoles();
          }
          if (choice == "View All Employees") {
            showAllEmployees();           
          }
          if (choice == "Add a Department") {
            addDepartment();
          }
          if (choice == "Add a Role") {
            addRole();
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

// department table functions
function showAllDepartments() {
  db.query(`SELECT * FROM department`, (err, results) => {
    if (err) {
      console.log(err);
    }
    console.table(results);
    return promptUser();
  })
}
function addDepartment() {
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

 //  role table functions
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
      const sql = `SELECT * FROM department WHERE name = ?`;
      const params = [`${choice.department}`];
      db.query(sql, params, (err, results) => {
          if (err) {
            console.log(err);
          }
          newRole.department_id = results[0].id;
          const {title, salary, department_id} = newRole;
          const sql = `INSERT INTO role (title, salary, department_id) VALUES (?,?,?)`;
          const params = [title, salary, department_id]
            db.query(sql, params, (err, results) => {
              if (err) {
                console.log(err);
              }
              console.log(`Added role to database`)
              return promptUser();
            })
        })
      })
    })
  })
}


// employee table functions
function showAllEmployees() {
  db.query(`SELECT * FROM employee`, (err, results) => {
    if (err) {
      console.log(err);
    }
    console.table(results);
    promptUser();
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

