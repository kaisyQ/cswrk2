const {ipcRenderer} = require('electron');

document.getElementById('footer-apply-button').addEventListener('click', (e) => {
    e.preventDefault();
    const user = [];
    for(let i = 0; i < document.querySelectorAll('form div input').length; ++i) {
        if(document.querySelectorAll('form div input').length[i].value === 'user' || document.querySelectorAll('form div input').length[i].value === 'admin'){
            if(document.querySelectorAll('form div input').length[i].checked){
                user.push(document.querySelectorAll('form div input').length[i].value);
            }
        } else {
            user.push(document.querySelectorAll('form div input').length[i].value);
        }
    }
    ipcRenderer.send('user-update-event', {user: user});
});

document.getElementById('footer-cancel-button').addEventListener('click', (e) => {
    e.preventDefault();
    ipcRenderer.send('cancel-changerole-event', {cancelChangeRole:true});
})