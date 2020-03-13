let mysql = require('mysql');
let con = mysql.createConnection({
<<<<<<< HEAD
    host: 'vps409067.ovh.net',
    port: '3306',
    user: 'grp1',
    password: 'UivAc8mO5vZrIF0w',
    database: 'grp1',
    multipleStatements: true
  });
=======
  host: 'vps409067.ovh.net',
  port: '3306',
  user: 'grp1',
  password: 'UivAc8mO5vZrIF0w',
  database: 'grp1',
  multipleStatements: true
});

>>>>>>> 99d0097e77f0d8cea418bbbf1491e0cca9e251b1
  
  con.connect((err) => {
    if(err){
      // console.log('Error connecting to DB');
      console.log(err)
      return;
    }
    console.log('Connection OK');
  });

  module.exports = con;