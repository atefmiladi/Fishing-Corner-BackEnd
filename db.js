const mysql = require('mysql')
const { Pool } = require('pg')

 pool  = mysql.createPool({
    host     : '127.0.0.1',
    user     : 'root',
    password : 'root',
    database : 'fishingcornerdb',
  });

  pool.getConnection(function(err, connection) {
    // Use the connection
    connection.query('SELECT * FROM user', function (error, results, fields) {
      // And done with the connection.
      connection.release();
  
      // Handle error after the release.
      if (error) throw error;
      
      // Don't use the connection here, it has been returned to the pool.
    });
  });