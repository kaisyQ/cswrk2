const {ipcRenderer} = require('electron');

const COUNT_OF_DIV = 5;

ipcRenderer.on('user-information-event', (e, user) => {
    document.querySelector('.header-greetings').innerText = `Hi ${user.userinfo.firstname}, Welcome to AMONIC Airlines.`;
    document.querySelector('.header-information-time').innerText = `Time spend on system: ${user.userinfo.birthdate}.`;
    document.querySelector('.header-information-countoflogouts').innerText = `Number of crashes: 0`;

    
    for(let i = 0; i < user.timeinfo.length; ++i) {
        const ul = document.querySelector('ul');
        const li = document.createElement('li');

        ul.appendChild(li);
        for (let j = 0; j < COUNT_OF_DIV; ++j) {
            const newDiv = document.createElement('div');
            switch (j) {
                case 0 :
                    newDiv.innerText = user.timeinfo[i]._date;
                    newDiv.className = 'first-li-div';
                    li.appendChild(newDiv);
                    break;
                case 1 :
                    newDiv.innerText = user.timeinfo[i].entry_time;
                    li.appendChild(newDiv);
                    break;
                case 2 :
                    if (user.timeinfo[i].exitTime) {
                        newDiv.innerText = user.timeinfo[i].exitTime;
                    } else {
                        newDiv.innerText = '**';
                    }
                    li.appendChild(newDiv);
                    break;
                case 3 :

                    if (user.timeinfo[i].exitTime) {
                        const entryTime = user.timeinfo[i].entry_time.split(':');
                        const exitTime = user.timeinfo[i].exitTime.split(':');
                        const timeInMinutes = parseInt(entryTime[0]) * 60 + parseInt(entryTime[1]) - (parseInt(exitTime[0]) * 60 + parseInt(exitTime[1]));
                        const timeSpentOnSystem = `${timeInMinutes / 60}:${timeInMinutes % 60}`;
                        newDiv.innerText = timeSpentOnSystem;
                    } else {
                        newDiv.innerText = '**';
                    }
                    li.appendChild(newDiv);
                    break;
                case 4 :
                    if (user.timeinfo[i].exitTime) {
                        newDiv.innerText = '$_--_$';
                    } else {
                        newDiv.innerText = user.timeinfo[i].logout_reason;
                    }
                    li.appendChild(newDiv);
                    newDiv.className = 'last-li-div';
                    break;
            }
        }
    }
});
