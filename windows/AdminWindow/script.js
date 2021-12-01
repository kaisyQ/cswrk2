const {ipcRenderer} = require('electron');

const COUNT_OF_DIV = 6;


ipcRenderer.on('send-all-users-info-event', (e, data) => {
    console.log(data.currentUser);
    for(let i = 0; i < data.arrayOfAllUsers.length; ++i) {
        if (data.arrayOfAllUsers[i].email === data.currentUser.email) {
            continue;
        } else {
            const ul = document.querySelector('ul');
            const li = document.createElement('li');

            ul.appendChild(li);
            for (let j = 0; j < COUNT_OF_DIV; ++j) {
                const newDiv = document.createElement('div');
                switch (j) {
                    case 0 :
                        newDiv.innerText = data.arrayOfAllUsers[i].firstname;
                        newDiv.className = 'first-li-div';
                        li.appendChild(newDiv);
                        break;
                    case 1 :
                        newDiv.innerText = data.arrayOfAllUsers[i].lastname;
                        li.appendChild(newDiv);
                        break;
                    case 2 :
                        newDiv.innerText = 20;
                        li.appendChild(newDiv);
                        break;
                    case 3 :
                        newDiv.innerText = data.arrayOfAllUsers[i].role_;
                        li.appendChild(newDiv);
                        break;
                    case 4 :
                        newDiv.innerText = data.arrayOfAllUsers[i].email;
                        li.appendChild(newDiv);
                        break;
                    case 5 :
                        newDiv.innerText = data.arrayOfAllUsers[i] = 'Russia';
                        newDiv.className = 'last-li-div';
                        li.appendChild(newDiv);
                        break;            
                }
            }
        }
    }
});
