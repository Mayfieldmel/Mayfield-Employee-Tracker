const inquirer = require("inquirer");    

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


    function promptAdd() {
        inquirer
        .prompt({
            type: "list",
            name: "choice",
            message: "What would you like to add?",
            choices: ["Employee", "Role", "Department", "Go Back"],
          })
    }

    function promptUpdate() {
        inquirer
        .prompt({
            type: "list",
            name: "choice",
            message: "What would you like to update?",
            choices: ["Employee", "Role", "Department", "Go Back"],
          })
    }

    function promptRemove() {
        inquirer
        .prompt({
            type: "list",
            name: "choice",
            message: "What would you like to remove?",
            choices: ["Employee", "Role", "Department", "Go Back"]
          })
    }

  module.exports = promptUser;