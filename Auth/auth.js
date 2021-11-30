const postgres = require('pg');
const client = new postgres.Client(require('./config'));

const CheckUserInDatabase = (user) => {

    try {
        client.connect();
    } catch (err) {
        console.error(err);
    }

    client.query('select * from users;', (err, res) => {
        if(err) {
            console.error(err);
        }
        client.end();

        for (dt in res.rows) {
            if (dt.name === user.username && dt.password === user.password) {
                return true;
            }
        }
        return false;
    })
}; 

module.exports = CheckUserInDatabase;