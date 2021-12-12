const postgres = require('pg');

const unbanUser = async(email) => {
    const client = new postgres.Client(require('./config'));
    try {
        await client.connect();
    } catch (err) {
        console.error(err);
    }

    await client.query(`update users
                        set active = true
                        where email = '${email}';`);

    await client.end();
    return true;
}

module.exports = unbanUser;