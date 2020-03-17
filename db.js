let mysql = require('mysql');
let con = mysql.createConnection({
    host: 'localhost',
    user: 'alex',
    password: 'root',
    database: 'nodejs'
  });
  
  con.connect((err) => {
    if(err){
      console.log('Error connecting to DB');
      return;
    }
    console.log('Connection OK');
  });

  module.exports = con;