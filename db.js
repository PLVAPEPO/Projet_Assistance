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
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'nodejs',
    multipleStatements: true
  });
>>>>>>> 4210567b573bce997f670cf1f8f51de64786b6ed
  
  con.connect((err) => {
    if(err){
      console.log('Error connecting to DB');
      return;
    }
    console.log('Connection OK');
  });

  module.exports = con;