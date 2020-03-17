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
>>>>>>> 5569e5bbdf25fd87e7151e7f5bfea49dc99e17ea


  
  con.connect((err) => {
    if(err){
      // console.log('Error connecting to DB');
      console.log(err)
      return;
    }
    console.log('Connection OK');
  });

  module.exports = con;