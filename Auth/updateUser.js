const postgres = require('pg');

const updateUser = async (user) => {
    const client = postgres.Client(require('./config'));
    try {
        await client.connect();
    } catch (err) {
        console.error(err);
    }

    const updatingUser = await client.query(``);
}

module.exports = updateUser;