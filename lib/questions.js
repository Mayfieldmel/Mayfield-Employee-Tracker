const inquirer = require("inquirer");    

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
        }
        
    
}
  module.exports = questions;