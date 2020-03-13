let mysql = require('mysql');
let con = mysql.createConnection({
    host: 'vps409067.ovh.net',
    port: '3306',
    user: 'grp1',
    password: 'UivAc8mO5vZrIF0w',
    database: 'grp1',
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