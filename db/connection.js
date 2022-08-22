const mysql = require("mysql2");

// Connect to database
const db = mysql.createConnection(
    {
      host: "localhost",
      // MySQL username,
      user: "root",
      // MySQL password
      password: "",
      database: "employees",
    },
  );

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
            showAllDepartments();
          }
          if (choice == "View All Roles") {
            roleLib.showAllRoles();
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
            addEmployee();
          }
          if (choice == "Update an Employee Role") {
            updateEmployeeRole();
          }
          if (choice == "Quit") {
            process.exit();
          }
        });
    }

module.exports = {db, promptUser};