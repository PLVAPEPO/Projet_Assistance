let mysql = require('mysql');
let con = mysql.createConnection({
    host: process.env.hostBdd,
    port: process.env.portBdd,
    user: process.env.userBdd,
    password: process.env.passwordBdd,
    database: process.env.nameBdd,
    multipleStatements: true
  });


  
  con.connect((err) => {
    if(err){
      console.log(err)
      return;
    }
    console.log('Connection OK');
  });

  module.exports = con;
