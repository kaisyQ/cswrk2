const postgres = require('pg');

const banUser = async(email) => {
    const client = new postgres.Client(require('./config'));
    try {
        await client.connect();
    } catch (err) {
        console.error(err);
    }

    await client.query(`update users
                        set active = false
                        where email = '${email}';`);

    await client.end();
    return true;
}

module.exports = banUser;