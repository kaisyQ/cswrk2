const {ipcRenderer} = require('electron');

ipcRenderer.on('send-all-users-info-event', (e, data) => {
    for(let i = 0; i < data.arrayOfAllUsers.length; ++i) {
        if (data.arrayOfAllUsers[i].email === data.currentUser.email) {
            continue;
        } else {
            
        }
    }
});
