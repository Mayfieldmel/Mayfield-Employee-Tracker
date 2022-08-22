// Import and require mysql2
const inquirer = require("inquirer");
const mysql = require("mysql2");

const db = require("./db/connection");
// const roleLib = require("./lib/Role");
// const initialPrompt = require("./lib/Prompt");

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
            console.log('--------');
            console.log('GOODBYE!')
            console.log('--------');
            process.exit();
          }
        });
    }

// department table functions
// view all departments in db
function showAllDepartments() {
  db.query(`SELECT * FROM department`, (err, results) => {
    if (err) {
      console.log(err);
    }
    console.table(results);
    return promptUser();
  })
}
// add a department to db
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
        console.log('-------------------------------');
        console.log(`Added ${input.name} to database`)
        console.log('-------------------------------');
        return promptUser();
      })
    })
}

 //  role table functions
//  view all roles in db
function showAllRoles(){
  const sql = `SELECT role.id, role.title, department.name AS department, CONCAT('$', FORMAT(role.salary, 0)) AS salary
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
// add role to db
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
    const sql = `SELECT * FROM department WHERE name = ?`;
    const params = [`${answers.department}`];
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
            console.log('------------------------------');
            console.log(`Added ${title} to database`)
            console.log('------------------------------');
            return promptUser();
          })
    })
  })
})
}


// employee table functions
// view all employees in db
function showAllEmployees() {
  const sql = `SELECT e.id, e.first_name, e.last_name, role.title, department.name AS department, CONCAT('$', FORMAT(role.salary, 0)) AS salary, CONCAT(m.first_name, " ", m.last_name) AS manager
  FROM employee e
  LEFT JOIN role ON role_id = role.id
  LEFT JOIN department ON department_id = department.id
  LEFT JOIN employee m ON e.manager_id = m.id`
  db.query(sql, (err, results) => {
    if (err) {
      console.log(err);
    }
    console.table(results);
    promptUser();
  })
}
// add employee to db
function addEmployee() {
  var rolesArr = [];
  db.query(`SELECT employee.first_name AS a, employee.last_name AS b FROM employee UNION ALL SELECT role.title, role.id FROM role`, (err, results) => {
    if (err) {
      console.log(err);
    }
   const namesArr = results.filter(index => {
    if (isNaN(index.b)) {
        return index;
    } else {
        rolesArr.push(index);
    }
   })
    rolesArr = rolesArr.map((results) => {
      const {a} = results;
      return `${a}`;       
  })
    const mFirstName = namesArr.map((results) => {
      const {a} = results;
      return `${a}`; 
    })
    const mLastName = namesArr.map((results) => {
      const {b} = results;
      return `${b}`; 
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
    console.log(answers)
    newEmployee.first_name = answers.first_name;
    newEmployee.last_name = answers.last_name;
    const sql = `SELECT * FROM role WHERE title = ?`;
    const params = [`${answers.role}`];
    db.query(sql, params, (err, results) => {
        if (err) {
          console.log(err);
        }
        console.log(results)
        newEmployee.role_id = results[0].id;
      
      if(answers.manager == 'None') {
        newEmployee.manager_id = null;
        console.log(newEmployee)
        const {first_name, last_name, role_id, manager_id} = newEmployee;
        const sql3 = `INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES (?,?,?,?)`;
        const params3 = [first_name, last_name, role_id, manager_id]
          db.query(sql3, params3, (err, results) => {
            if (err) {
              console.log(err);
            }
            console.log('----------------------------------------------------');
            console.log(`Added ${first_name} ${last_name} to database`)
            console.log('----------------------------------------------------');
            return promptUser();
          })
      } else {
      const sql2 = `SELECT * FROM employee WHERE first_name = ? AND last_name = ?`;
      const params2 = answers.manager.split(" ");
      console.log(params)
      db.query(sql2, params2, (err, results) => {
          if (err) {
            console.log(err);
          }
          newEmployee.manager_id = results[0].id;
          console.log(newEmployee)
          const {first_name, last_name, role_id, manager_id} = newEmployee;
          const sql3 = `INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES (?,?,?,?)`;
          const params3 = [first_name, last_name, role_id, manager_id]
            db.query(sql3, params3, (err, results) => {
              if (err) {
                console.log(err);
              }
              console.log('----------------------------------------------------');
              console.log(`Added ${first_name} ${last_name} to database`)
              console.log('----------------------------------------------------');
              return promptUser();
            })
        })
      }
    })
    })
})
}
// update employee's role
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
          db.query(sql2, params2, (err, result) => {
            if (err) {
              console.log(err);
            }
          const id = result[0].id;
          const sql3 = `UPDATE employee SET role_id = ? WHERE id = ?`;
          const params3 = [role_id, id]
          
            db.query(sql3, params3, (err, results) => {
              if (err) {
                console.log(err);
              }
              console.log('-------------------------------');
              console.log(`Added ${role_id} to database`)
              console.log('-------------------------------');
              return promptUser();
            })
          })
        })
      })  
    })
}