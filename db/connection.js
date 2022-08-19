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
    console.log(`Connected to the employee database.`)
  );