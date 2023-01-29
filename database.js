const mysql = require("mysql2");

module.exports = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "Yellhtet@2488",
  database: "sample_app",
});
