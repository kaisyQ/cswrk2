const postgres = require('pg');

const GetAllUsersFromDatabase = async () => {
    const client = new postgres.Client(require('./config'));
    
    try {
        await client.connect();
    } catch (err) {
        console.error(err);
    }
    const con = await client.query(`select (role_title, office_title, email, firstname, lastname, birthdate) from users
                                    join Roles on users.role_id = Roles.id
                                    join Offices on users.office_id = Offices.id;`);
    if (con) {
        await client.end();
        const resultUserData = [];
        for(let i = 0; i < con.rows.length; ++i) {
            resultUserData.push(con.rows[i].row.split('(')[1].split(')')[0].split(','))
        }   
        return resultUserData;
    } else {
        console.error('Query error !');
    }
}; 

module.exports = GetAllUsersFromDatabase;

