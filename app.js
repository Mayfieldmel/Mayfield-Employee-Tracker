// Import and require mysql2
const inquirer = require("inquirer");
const mysql = require("mysql2");

const db = require("./db/connection");
const { getRoles, addRoleToDB, findRoleId } = require("./lib/role");
const { getDepartments, addDepartment, findDepartmentId } = require("./lib/department");
const { getEmployees, addEmployee, findEmployeeId } = require("./lib/employee");
// const initialPrompt = require("./lib/Prompt");

require("console.table");

// initialize app
startApp();
promptUser();

function startApp() {
  console.log("-------------------------");
  console.log("Mayfield Employee Tracker");
  console.log("-------------------------");
}

var newRole = {};
var newEmployee = {};

// initial prompt
function promptUser() {
  inquirer
    .prompt({
      type: "list",
      name: "choice",
      message: "What would you like to do?",
      choices: [
        "View All Departments",
        "View All Roles",
        "View All Employees",
        "Add a Department",
        "Add a Role",
        "Add an Employee",
        "Update an Employee Role",
        "Quit",
      ],
    })
    .then(({ choice }) => {
      if (choice == "View All Departments") {
        viewAllDepartments();
      }
      if (choice == "View All Roles") {
        viewAllRoles();
      }
      if (choice == "View All Employees") {
        viewAllEmployees();
      }
      if (choice == "Add a Department") {
        addADepartment();
      }
      if (choice == "Add a Role") {
        addRole();
      }
      if (choice == "Add an Employee") {
        addAnEmployee();
      }
      if (choice == "Update an Employee Role") {
        updateEmployeeRole();
      }
      if (choice == "Quit") {
        console.log("--------");
        console.log("GOODBYE!");
        console.log("--------");
        process.exit();
      }
    });
}

// department table functions
// view all departments in db
function viewAllDepartments() {
  getDepartments()
    .then(([results]) => {
      console.table(results);
      return promptUser();
    })
    .catch((err) => {
      console.log(err);
    });
}
// add a department to db
function addADepartment() {
  inquirer
    .prompt({
      type: "input",
      name: "name",
      message: "What is the name of the department?",
    })
    // add input to db
    .then((input) => {
      addDepartment(input)
        .then(() => {
          console.log("-----------------------------------------");
          console.log(`Added ${input.name} to employees database`);
          console.log("-----------------------------------------");
          return promptUser();
        })
        .catch((err) => {
          console.log(err);
        });
    });
}

//  role table functions
//  view all roles in db
function viewAllRoles() {
  getRoles()
    .then(([results]) => {
      console.table(results);
      promptUser();
    })
    .catch((err) => {
      console.log(err);
    });
}
// add role to db
function addRole() {
  getDepartments()
    .then(([results]) => {
      const departmentArr = results.map((results) => {
        const { name } = results;
        return `${name}`;
      });
      return (
        inquirer
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
              choices: departmentArr,
            },
          ])
          // take input and add it to role
          .then((answers) => {
            newRole.title = answers.title;
            newRole.salary = answers.salary;
            // find department id by name
            findDepartmentId(answers.department)
              .then(([result]) => {
                // add department id to role
                newRole.department_id = result[0].id;
                // add role to db
                addRoleToDB(newRole)
                  .then(() => {
                    console.log(
                      "----------------------------------------------"
                    );
                    console.log(`Added ${answers.title} to employees database`);
                    console.log(
                      "----------------------------------------------"
                    );
                    return promptUser();
                  })
                  .catch((err) => {
                    console.log(err);
                  });
              })
              .catch((err) => {
                console.log(err);
              });
          })
      );
    })
    .catch((err) => {
      console.log(err);
    });
}

// employee table functions
// view all employees in db
function viewAllEmployees() {
  getEmployees()
  .then(([results]) => {
    console.table(results);
    promptUser();
  })
  .catch((err) => {
    console.log(err);
  });
}
// add employee to db
function addAnEmployee() {
  var rolesArr = [];
  const sql = `SELECT employee.first_name AS a, employee.last_name AS b FROM employee UNION ALL SELECT role.title, role.id FROM role`;
  // query to form choices list
  db.query(sql, (err, results) => {
    if (err) {
      console.log(err);
    }
    const namesArr = results.filter((index) => {
      if (isNaN(index.b)) {
        return index;
      } else {
        rolesArr.push(index);
      }
    });
    rolesArr = rolesArr.map((results) => {
      const { a } = results;
      return `${a}`;
    });
    const mFirstName = namesArr.map((results) => {
      const { a } = results;
      return `${a}`;
    });
    const mLastName = namesArr.map((results) => {
      const { b } = results;
      return `${b}`;
    });
    managerArr = mFirstName.map((a, index) => {
      const b = mLastName[index];
      return `${a} ${b}`;
    });
    // add None as choice option
    managerArr.push("None");
    // prompt user
    return (
      inquirer
        .prompt([
          {
            type: "input",
            name: "first_name",
            message: "What is the employee's first name?",
          },
          {
            type: "input",
            name: "last_name",
            message: "What is the employees last name?",
          },
          {
            type: "list",
            name: "role",
            message: "What is the employee's role?",
            choices: rolesArr,
          },
          {
            type: "list",
            name: "manager",
            message: "Who is the employee's manager?",
            choices: managerArr,
          },
        ])
        // take input and create new employee
        .then((answers) => {
          newEmployee.first_name = answers.first_name;
          newEmployee.last_name = answers.last_name;
          // find role id by role name
          findRoleId(answers)
            .then(([result]) => {
            newEmployee.role_id = result[0].id;
            // if employee has no manager
            if (answers.manager == "None") {
              newEmployee.manager_id = null;
              addEmployee(newEmployee)
              .then(() => {
                console.log("------------------------------------------------------");
                console.log(`Added ${answers.first_name} ${answers.last_name} to employees database`);
                console.log("------------------------------------------------------");
                return promptUser();
              });
            // if employee has a manager
            } else {
              findEmployeeId(answers.manager)
              .then(([result]) => {
                newEmployee.manager_id = result[0].id;
                // add to new employee to db
                addEmployee(newEmployee)
              .then(() => {
                console.log("------------------------------------------------------");
                console.log(`Added ${first_name} ${last_name} to employees database`);
                console.log("------------------------------------------------------");
                return promptUser();
              });
              });
            }
          });
        })
    );
  });
}
// update employee's role
function updateEmployeeRole() {
  // query to form choices list
  var rolesArr = [];
  const sql = `SELECT employee.first_name AS a, employee.last_name AS b FROM employee UNION ALL SELECT role.title, role.id FROM role`;
  // query to form choices list
  db.query(sql, (err, results) => {
    if (err) {
      console.log(err);
    }
    const namesArr = results.filter((index) => {
      if (isNaN(index.b)) {
        return index;
      } else {
        rolesArr.push(index);
      }
    });
    rolesArr = rolesArr.map((results) => {
      const { a } = results;
      return `${a}`;
    });
    const mFirstName = namesArr.map((results) => {
      const { a } = results;
      return `${a}`;
    });
    const mLastName = namesArr.map((results) => {
      const { b } = results;
      return `${b}`;
    });
    employeeArr = mFirstName.map((a, index) => {
      const b = mLastName[index];
      return `${a} ${b}`;
    });
    // prompt user
    return (
      inquirer
        .prompt([
          {
            type: "list",
            name: "employee",
            message: "Which employee's role do you want to update?",
            choices: employeeArr,
          },
          {
            type: "list",
            name: "role",
            message: "Which role do you want to assign the employee?",
            choices: rolesArr,
          },
        ])
        // take input and reformat
        .then((choice) => {
          var { employee, role } = choice;
          const sql = `SELECT * FROM role WHERE title = ?`;
          const params = [role];
          db.query(sql, params, (err, results) => {
            if (err) {
              console.log(err);
            }
            const role_id = results[0].id;
            employee = employee.split(" ");
            const sql2 = `SELECT id FROM employee WHERE first_name = ? AND last_name = ?`;
            const params2 = [employee[0], employee[1]];
            db.query(sql2, params2, (err, result) => {
              if (err) {
                console.log(err);
              }
              const id = result[0].id;
              // update db with reformated data
              const sql3 = `UPDATE employee SET role_id = ? WHERE id = ?`;
              const params3 = [role_id, id];
              db.query(sql3, params3, (err, results) => {
                if (err) {
                  console.log(err);
                }
                console.log(
                  "-------------------------------------------------------------------"
                );
                console.log(
                  `Updated ${employee[0]} ${employee[1]}'s role in employees database`
                );
                console.log(
                  "-------------------------------------------------------------------"
                );
                return promptUser();
              });
            });
          });
        })
    );
  });
}
