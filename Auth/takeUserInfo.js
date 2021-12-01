const postgres = require('pg');

const TakeUserInfoFromDataBase = async (username) => {

    const client = new postgres.Client(require('./config'));
     
    try {
        await client.connect();
    } catch (err) {
        console.error(err);
    }

    const userinfo = await client.query('select * from users;');
    for(let i = 0; i < userinfo.rows.length; ++i) {
        if (userinfo.rows[i].email === username) {
            await client.end();
            return userinfo.rows[i];
        }
    }
    await client.end();
};

module.exports = TakeUserInfoFromDataBase;