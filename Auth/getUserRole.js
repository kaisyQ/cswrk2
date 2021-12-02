const postgres = require('pg');

const getUserRole = async (username) => {
    const client = new postgres.Client(require('./config'));
    try {
        await client.connect();
    } catch (err) {
        console.log(err);
    }

    const role = await client.query(`select (role_title) from Roles
                                    join users on users.role_id = Roles.id
                                    where email = '${username}';`);
    client.end();
    return role.rows[0].role_title;
};

module.exports = getUserRole;