const inquirer = require("inquirer");    
const db = require("../db/connection");

 
const questions = {
    promptUser: 
        {
            type: "list",
            name: "choice",
            message: "What would you like to do?",
            choices: ["View All Departments", "View All Roles", "View All Employees", "Add a Department", "Add a Role", "Add an Employee", "Update an Employee Role", "Quit"],
        },
    promptAddDepartment:
        {
            type: "input",
            name: "name",
            message: "What is the name of the department?",
        },
    promptAddRole:
        [
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
            // {
            //     type: "list",
            //     name: "roles",
            //     message: "Which department does the role belong to?",
            //     choices: rolesArr
            //   }
        ]
        
        
    
}
  module.exports = questions;


