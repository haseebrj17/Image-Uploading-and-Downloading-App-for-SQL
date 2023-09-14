const sql = require('mssql')

const config = {
    user: 'username',
    password: 'password',
    server: 'server_name.database.windows.net',
    database: 'database_name',

    options: {
        encrypt: true
    }
}

sql.connect(config).then(function() {
    // Connection succeeded
}).catch(function(err) {
    // Connection failed
    console.log(err);
});

module.exports = sql;
