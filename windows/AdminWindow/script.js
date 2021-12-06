const {ipcRenderer} = require('electron');

const COUNT_OF_DIV = 6;
const ROLE_POS = 0;
const OFFICE_POS = 1;
const EMAIL_POS = 2;
const FIRSTNAME_POS = 3;
const LASTNAME_POS = 4;
const BIRTHDATE_POS = 5;

let afterLoadPage = false;
let arrayOfUsers;
let currentUser;

const updateDataInterval = setInterval(() => {
    if(afterLoadPage) {
        ipcRenderer.send('take-data-from-database-event', {isTakenData:false});
    }
}, 1000)

ipcRenderer.on('admin-window-data-from-db', (e, data) => {
    let isNewData = arrayOfUsers.compareArrays(data.arrayOfAllUsers);
    if(isNewData) {
        ipcRenderer.send('interval-update', {isUpdated:false});
    }
})

ipcRenderer.on('update-AdminWindow', (e, data) => {
    const allUlLi = document.querySelectorAll('ul li');
    for(let i = 0; i < allUlLi.length; ++i) {
        if(allUlLi[i].id === 'first li') {
            continue;
        } else {
            allUlLi[i].parentNode.removeChild(allUlLi[i]);
        }
    }

    const headerLi = document.createElement('li');
    document.querySelector('ul').appendChild(headerLi);
    let fistLiDiv = document.createElement('div');
    fistLiDiv.innerText = 'Name';
    fistLiDiv.className = 'first-li-div';
    headerLi.appendChild(fistLiDiv);

    let fistLiDiv2 = document.createElement('div');
    fistLiDiv2.innerText = 'LastName';
    headerLi.appendChild(fistLiDiv2);

    let fistLiDiv3 = document.createElement('div');
    fistLiDiv3.innerText = 'Age';
    headerLi.appendChild(fistLiDiv3);

    let fistLiDiv4 = document.createElement('div');
    fistLiDiv4.innerText = 'User Role';
    headerLi.appendChild(fistLiDiv4);

    let fistLiDiv5 = document.createElement('div');
    fistLiDiv5.innerText = 'Email Address';
    headerLi.appendChild(fistLiDiv5);

    let fistLiDiv6 = document.createElement('div');
    fistLiDiv6.innerText = 'Office';
    fistLiDiv6.className = 'last-li-div';
    headerLi.appendChild(fistLiDiv6);

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

ipcRenderer.on('send-all-users-info-event', (e, data) => {
    afterLoadPage = true;
    arrayOfUsers = data.arrayOfAllUsers;
    currentUser = data.currentUser;
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