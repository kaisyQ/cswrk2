const postgres = require('pg');

const AddUserToDatabase = async (user) => {
    const client = new postgres.Client(require('./config'));
    
    try {
        await client.connect();
    } catch (err) {
        console.error(err);
    }
    const getOfficeId = await client.query(`select * from Offices where office_title = '${user.office}';`);
    console.log(getOfficeId.rows[0].id)
    await client.query(
        `insert into users(office_id, role_id, email, psswrd, firstname, lastname, birthdate, active) values
            (${getOfficeId.rows[0].id}, 2, '${user.email}', '${user.password}', '${user.firstname}', '${user.lastname}', '${user.birthdate}', '04:05:06');`);
    await client.end();
};

module.exports = AddUserToDatabase;
