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
            choices: ["View", "Add ", "Update", "Remove", "Quit"],
          })
        .then(({ choice }) => {
        switch (choice) {
            case "View":
            promptView();
            break;
            case "Add":
            promptAdd()
            break;
            case "Update":
            promptUpdate()
            break;
            case "Remove":
            promptRemove()
            break;
            default:
            process.exit();
        }
        });
    }

// view options
function promptView() {
    inquirer
    .prompt({
        type: "list",
        name: "choice",
        message: "What would you like to view?",
        choices: ["All Employees", "All roles", "All departments", "Go Back"],
      })
      .then(choice => {return choice})
    }

// add options
function promptAdd() {
    inquirer
    .prompt({
        type: "list",
        name: "choice",
        message: "What would you like to add?",
        choices: ["Employee", "Role", "Department", "Go Back"],
      })
}

// update options
function promptUpdate() {
    inquirer
    .prompt({
        type: "list",
        name: "choice",
        message: "What would you like to update?",
        choices: ["Employee", "Role", "Department", "Go Back"],
      })
}

// remove options
function promptRemove() {
    inquirer
    .prompt({
        type: "list",
        name: "choice",
        message: "What would you like to remove?",
        choices: ["Employee", "Role", "Department", "Go Back"]
      })
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

