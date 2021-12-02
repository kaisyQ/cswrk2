const postgres = require('pg');

const AddUserToDatabase = async (user) => {
    const client = new postgres.Client(require('./config'));
    
    try {
        await client.connect();
    } catch (err) {
        console.error(err);
    }
    const getOfficeId = await client.query(`select * from Offices where office_title = '${user.office}'';`);
    await client.query(
        `insert into users(role_, email, firstname, lastname, psswrd) values
            ('User', '${user.email}', '${user.firstname}', '${user.lastname}', '${user.password}');`);
    await client.end();
}; 
 
module.exports = AddUserToDatabase;
