const {ipcRenderer} = require('electron');

const COUNT_OF_DIV = 6;
const ROLE_POS = 0;
const OFFICE_POS = 1;
const EMAIL_POS = 2;
const FIRSTNAME_POS = 3;
const LASTNAME_POS = 4;
const BIRTHDATE_POS = 5;


ipcRenderer.on('send-all-users-info-event', (e, data) => {
    for(let i = 0; i < data.arrayOfAllUsers.length; ++i) {
        if (data.arrayOfAllUsers[i][EMAIL_POS] === data.currentUser.email) {
            continue;
        } else {
            const ul = document.querySelector('ul');
            const li = document.createElement('li');

            ul.appendChild(li);
            for (let j = 0; j < COUNT_OF_DIV; ++j) {
                const newDiv = document.createElement('div');
                switch (j) {
                    case 0 :
                        newDiv.innerText = data.arrayOfAllUsers[i][FIRSTNAME_POS];
                        newDiv.className = 'first-li-div';
                        li.appendChild(newDiv);
                        break;
                    case 1 :
                        newDiv.innerText = data.arrayOfAllUsers[i][LASTNAME_POS];
                        li.appendChild(newDiv);
                        break;
                    case 2 :
                        const brthdt = data.arrayOfAllUsers[i][BIRTHDATE_POS].split('-');
                        //..Нужно посчитать кол-во лет пользователя, и положить это значение в newDiv.innerText
                        newDiv.innerText = data.arrayOfAllUsers[i][BIRTHDATE_POS];
                        li.appendChild(newDiv);
                        break;
                    case 3 :
                        newDiv.innerText = data.arrayOfAllUsers[i][ROLE_POS];
                        li.appendChild(newDiv);
                        break;
                    case 4 :
                        newDiv.innerText = data.arrayOfAllUsers[i][EMAIL_POS];
                        li.appendChild(newDiv);
                        break;
                    case 5 :
                        newDiv.innerText = data.arrayOfAllUsers[i][OFFICE_POS];
                        newDiv.className = 'last-li-div';
                        li.appendChild(newDiv);
                        break;            
                }
            }
        }
    }
});

document.getElementById('changerole-button').addEventListener('click', (e) => {
    e.preventDefault();
    ipcRenderer.send('admin-changerole-event', {changeRole: true});
});