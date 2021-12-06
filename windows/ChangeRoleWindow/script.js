const {ipcRenderer} = require('electron');
let isUserUpdated = false;

document.getElementById('footer-apply-button').addEventListener('click', (e) => {
    e.preventDefault();
    const user = [];
    for(let i = 0; i < document.querySelectorAll('form div input').length; ++i) {
        if(document.querySelectorAll('form div input')[i].value === 'user' || document.querySelectorAll('form div input')[i].value === 'admin'){
            if(document.querySelectorAll('form div input')[i].checked){
                user.push(document.querySelectorAll('form div input')[i].value);
            }
        } else {
            user.push(document.querySelectorAll('form div input')[i].value);
        }
    }
    ipcRenderer.send('user-update-event', {user: user});
});

document.getElementById('footer-cancel-button').addEventListener('click', (e) => {
    e.preventDefault();
    ipcRenderer.send('cancel-changerole-event', {cancelChangeRole: true});
})

ipcRenderer.on('user-not-found', () => {
    const modal = document.querySelector('.modal');
    document.getElementById('modal-text-header').innerText = 'Error!';
    document.getElementById('modal-text-content').innerText = 'This user does not exist';
    const instance = M.Modal.init(modal);
    instance.open();
});

ipcRenderer.on('user-successfully-updated', () => {
    const modal = document.querySelector('.modal');
    document.getElementById('modal-text-header').innerText = 'Information!';
    document.getElementById('modal-text-content').innerText = 'The user was successfully updated';
    const instance = M.Modal.init(modal);
    instance.open();

    document.querySelector('#modal1 div a').addEventListener('click', (e) => {
        e.preventDefault();
        ipcRenderer.send('cancel-changerole-event');
    })
});

ipcRenderer.on('AdminRole-update', () => {
    const modal = document.querySelector('.modal');
    document.getElementById('modal-text-header').innerText = 'Error!';
    document.getElementById('modal-text-content').innerText = 'Can not change admin role';
    const instance = M.Modal.init(modal);
    instance.open();
});

ipcRenderer.on('bad-update', () => {
    const modal = document.querySelector('.modal');
    document.getElementById('modal-text-header').innerText = 'Error!';
    document.getElementById('modal-text-content').innerText = 'Bad update';
    const instance = M.Modal.init(modal);
    instance.open();
});


