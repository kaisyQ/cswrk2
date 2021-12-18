const postgres = require('pg');

const isUserActive = async(email) => {
    const client = new postgres.Client(require('./config'));
    try {
        await client.connect();
    } catch (err) {
        console.log(err);
    }

    const isActive = await client.query(`select (active) from users
                                    where email = '${email}';`);
    client.end();
    return isActive.rows[0].active;
};

module.exports = isUserActive;