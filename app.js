// Import and require mysql2
const inquirer = require("inquirer");
const mysql = require("mysql2");
const db = require("./db/connection");
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

// initial prompt
function promptUser() {
    inquirer
        .prompt({
            type: "list",
            name: "choice",
            message: "What would you like to do?",
            choices: ["View All Departments", "View All Roles", "View All Employees", "Add a Department", "Add a Role", "Add an Employee", "Update an Employee Role", "Quit"],
          })
        .then(({ choice }) => {
          if (choice == "View All Departments") {
            db.query(`SELECT * FROM department`, (err, results) => {
              if (err) {
                console.log(err);
              }
              console.table(results);
              promptUser();
            })
          }
          if (choice == "View All Roles") {
            db.query(`SELECT * FROM department`, (err, results) => {
              if (err) {
                console.log(err);
              }
              console.table(results);
              promptUser();
            })
          }
          if (choice == "View All Employees") {
            db.query(`SELECT * FROM department`, (err, results) => {
              if (err) {
                console.log(err);
              }
              console.table(results);
              promptUser();
            })
          }
          if (choice == "Add a Department") {

          }
          if (choice == "Add a Role") {

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

