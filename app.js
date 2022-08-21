// Import and require mysql2
const inquirer = require("inquirer");
const mysql = require("mysql2");

const db = require("./db/connection");
const roleLib = require("./lib/Role");

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
var newEmployee = {};

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
    .prompt({
      type: "input",
      name: "name",
      message: "What is the name of the department?",
  })
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
            return promptUser();
          })
    })
  })
})
}


// employee table functions
function showAllEmployees() {
  const sql = `SELECT e.id, e.first_name, e.last_name, role.title, department.name AS department, role.salary
  FROM employee e
  LEFT JOIN role ON role_id = role.id
  LEFT JOIN department ON department_id = department.id`
  // ,  m.first_name || ' ' || m.last_name AS manager
  // LEFT JOIN employee m ON e.manager_id = m.employee.id`
  db.query(sql, (err, results) => {
    if (err) {
      console.log(err);
    }
    console.table(results);
    promptUser();
  })
}

function addEmployee() {
  db.query(`SELECT employee.*, role.title FROM employee LEFT JOIN role ON role_id = role.id`, (err, results) => {
    if (err) {
      console.log(err);
    }
    const rolesArr = results.map((results) => {
      const {title} = results;
      return `${title}`;       
  })
    const mFirstName = results.map((results) => {
      const {first_name} = results;
      return `${first_name}`; 
    })
    const mLastName = results.map((results) => {
      const {last_name} = results;
      return `${last_name}`; 
    })
   managerArr = mFirstName.map((a, index) => {
        const b = mLastName[index];
        return `${a} ${b}`
    })
    managerArr.push("None")
  return inquirer
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
      choices: rolesArr
    },
      {
      type: "list",
      name: "manager",
      message: "Who is the employee's manager?",
      choices: managerArr
    }
])
  .then((answers) => { 
    newEmployee.first_name = answers.first_name;
    newEmployee.last_name = answers.last_name;
    const sql = `SELECT * FROM role WHERE title = ?`;
    const params = [`${answers.role}`];
    db.query(sql, params, (err, results) => {
        if (err) {
          console.log(err);
        }
        newEmployee.role_id = results[0].id;
      })
      const sql2 = `SELECT * FROM employee WHERE first_name = ? AND last_name = ?`;
      const params2 = answers.manager.split(" ");
      db.query(sql2, params2, (err, results) => {
          if (err) {
            console.log(err);
          }
          newEmployee.manager_id = results[0].id;
          const {first_name, last_name, role_id, manager_id} = newEmployee;
          const sql3 = `INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES (?,?,?,?)`;
          const params3 = [first_name, last_name, role_id, manager_id]
            db.query(sql3, params3, (err, results) => {
              if (err) {
                console.log(err);
              }
              console.log(`Added employee to database`)
              return promptUser();
            })
        })
    })
})
}

function updateEmployeeRole() {
  const sql = `SELECT employee.id, employee.first_name, employee.last_name, role.title
  FROM employee 
  LEFT JOIN role ON role_id = role.id`;
  db.query(sql, (err, results) => {
    if (err) {
      console.log(err);
    }
    const rolesArr = results.map((results) => {
      const {title} = results;
      return `${title}`;       
  })
    console.table(results)
    const eFirstName = results.map((results) => {
      const {first_name} = results;
      return `${first_name}`; 
    })
    const eLastName = results.map((results) => {
      const {last_name} = results;
      return `${last_name}`; 
    })
    const employeeArr = eFirstName.map((a, index) => {
      const b = eLastName[index];
      return `${a} ${b}`
    })
    return inquirer
    .prompt([
      {
        type: "list",
        name: "employee",
        message: "Which employee's role do you want to update?",
        choices: employeeArr 
      },
      {
        type: "list",
        name: "role",
        message: "Which role do you want to assign the employee?",
        choices: rolesArr
      },
    ]) 
    .then(choice => {
      console.log(choice)
      var {employee, role} = choice;
      const sql = `SELECT * FROM role WHERE title = ?`;
      const params = [role];
      db.query(sql, params, (err, results) => {
        if (err) {
          console.log(err);
        }
        const role_id = results[0].id;
        employee = employee.split(" ")
        const sql2 = `SELECT id FROM employee WHERE first_name = ? AND last_name = ?`;
        const params2 = [employee[0], employee[1]]
        console.log(params2)
          db.query(sql2, params2, (err, result) => {
            if (err) {
              console.log(err);
            }
          const id = result[0].id;
          console.log(id)
          const sql3 = `UPDATE employee SET role_id = ? WHERE id = ?`;
          const params3 = [role_id, id]
          console.log(params3)
            db.query(sql3, params3, (err, results) => {
              if (err) {
                console.log(err);
              }
              console.log(`updated role added to database`)
              return promptUser();
            })
          })
        })
      })  
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




// check database connection
// db.connect(err => {
//   if (err) throw err;
//   console.log(`Connected to the employee database.`);
// });

