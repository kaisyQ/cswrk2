const postgres = require('pg');

const GetAllUsersFromDatabase = async () => {
    const client = new postgres.Client(require('./config'));
    
    try {
        await client.connect();
    } catch (err) {
        console.error(err);
    }

    const con = await client.query('select * from users');

    if (con) {
        await client.end();
        return con.rows;
    } else {
        console.error('Query error !');
    }
}; 

module.exports = GetAllUsersFromDatabase;

