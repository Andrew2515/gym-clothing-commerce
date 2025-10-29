const mysql = require('mysql2');

// Now create connections 
const pool = mysql.createPool({
    host: 'localhost',     // Having mysql local
    user:  'root',         // Username
    password: 'root',      // Password
    database: 'g00472939'  // Database ID

});

module.exports = pool.promise(); // Exporting pool so other files can use this
