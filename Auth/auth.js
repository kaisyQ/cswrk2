const postgres = require('pg');

const CheckUserInDatabase = async (user) => {
    const client = new postgres.Client(require('./config'));
    
    try {
        await client.connect();
    } catch (err) {
        console.error(err);
    }

    const con = await client.query('select * from users');

    if (con) {
        for (let i = 0; i < con.rows.length; ++i) {
            if (con.rows[i].email === user.email && con.rows[i].psswrd == user.password) {
                await client.end();
                return true;
            }
        }
        await client.end();
        return false;
    } else {
        console.error('Query error !');
    }
}; 


module.exports = CheckUserInDatabase;