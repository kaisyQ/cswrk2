const postgres = require('pg');


class UsersTime {
    async AddEnterTime (user) {
        const client = new postgres.Client(require('./config'));
        
        try {
            await client.connect();
        } catch (err) {
            console.error(err);
        }
    
        
        const dateObj = new Date();
        const timeArr = new Array(3);
        const DateArr = new Array(3);
    
        timeArr[0] = '' + (dateObj.getHours() >= 12 ? `${dateObj.getHours()}` : `0${dateObj.getHours()}`);
        timeArr[1] = '' + (dateObj.getMinutes() >= 10 ? `${dateObj.getMinutes()}` : `0${dateObj.getMinutes()}`);
        timeArr[2] = '' + (dateObj.getSeconds() >= 10 ? `${dateObj.getSeconds()}` : `0${dateObj.getSeconds()}`);
        const enterTime = timeArr[0] + ':' + timeArr[1] + ':' + timeArr[2];
    
        DateArr[0] = dateObj.getFullYear().toString();
        DateArr[1] = '' + (dateObj.getMonth() + 1 >= 10 ? `${dateObj.getMonth() + 1}` : `0${dateObj.getMonth() + 1}`);
        DateArr[2] = '' + (dateObj.getDate() >= 10 ? `${dateObj.getDate()}` : `0${dateObj.getDate()}`);
        const enterDate = DateArr[0] + '-' + DateArr[1] + '-' + DateArr[2];
    
        const con = await client.query(`insert into UsersTimeInfo(user_id, entry_time, _date) values
                                        (${user.id}, '${enterTime}', '${enterDate}');`);
        await client.end();
    }; 
    
    async GetUserTimeInfo (user) {
        const client = new postgres.Client(require('./config'));
        
        try {
            await client.connect();
        } catch (err) {
            console.error(err);
        }

        const con = await client.query(`select * from UsersTimeInfo where user_id = ${user.id}`);
        await client.end();
        return con.rows;
    };

    async updateLogReason (data) {
        const client = new postgres.Client(require('./config'));
        try {
            await client.connect();
        } catch (err) {
            console.error(err);
        }
    
        await client.query(`update UsersTimeinfo
                            set logout_reason = '${data.logReason}'
                            where id = '${data.id}';`);
    
        await client.end();
        return true;
    };

    async AddExitTime (id) {
        const client = new postgres.Client(require('./config'));
        try {
            await client.connect();
        } catch (err) {
            console.error(err);
        }
        
        const dateObj = new Date();
        const timeArr = new Array(3);
        timeArr[0] = '' + (dateObj.getHours() >= 12 ? `${dateObj.getHours()}` : `0${dateObj.getHours()}`);
        timeArr[1] = '' + (dateObj.getMinutes() >= 10 ? `${dateObj.getMinutes()}` : `0${dateObj.getMinutes()}`);
        timeArr[2] = '' + (dateObj.getSeconds() >= 10 ? `${dateObj.getSeconds()}` : `0${dateObj.getSeconds()}`);
        const exitTime = timeArr[0] + ':' + timeArr[1] + ':' + timeArr[2];

        await client.query(`update UsersTimeinfo
                            set exit_time = '${exitTime}'
                            where id = '${id}';`);
    
        await client.end();
        return true;
    }

}

module.exports = new UsersTime();

