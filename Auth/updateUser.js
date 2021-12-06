const postgres = require('pg');

const updateUser = async (email) => {
    const client = new postgres.Client(require('./config'));
    try {
        await client.connect();
    } catch (err) {
        console.error(err);
    }

    await client.query(`update users
                        set role_id = 1
                        where email = '${email}';`);

    await client.end();
    return true;
}

module.exports = updateUser;