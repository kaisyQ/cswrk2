document.getElementById('submit-button').addEventListener('click', (e) => {
    
    e.preventDefault();
    const electron = require('electron');
    const {ipcRenderer} = electron;
    const username = document.querySelector('#username').value;
    const password = document.querySelector('#password').value;

    if(username && password) {
        ipcRenderer.send('login-user-event', {
            username: username,
            password: password
        });
    } else {
        const modal = document.querySelector('.modal');
        document.getElementById('modal-text-header').innerText = 'Error!';
        document.getElementById('modal-text-content').innerText = 'Please, fill in the fields';
        const instance = M.Modal.init(modal);
        instance.open();
    }

    ipcRenderer.on('not-correct-user', (e, user) => {
        const modal = document.querySelector('.modal');
        document.getElementById('modal-text-header').innerText = 'Authorization error!';
        document.getElementById('modal-text-content').innerText = 'Incorrect username or password. Please, try again';
        const instance = M.Modal.init(modal);
        instance.open();

        document.querySelector('#password').value = null;
    });
});


