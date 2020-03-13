let mysql = require('mysql');
let con = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'nodejs',
    multipleStatements: true
  });
  
  con.connect((err) => {
    if(err){
      console.log('Error connecting to DB');
      return;
    }
    console.log('Connection OK');
  });

  module.exports = con;