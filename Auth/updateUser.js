const postgres = require('pg');

const updateUser = async (user) => {
    const client = postgres.Client(require('./config'));
    try {
        await client.connect();
    } catch (err) {
        console.error(err);
    }

    client.q
}

module.exports = updateUser;