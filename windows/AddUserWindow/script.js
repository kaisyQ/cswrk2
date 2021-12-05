const {ipcRenderer} = require('electron');

const saveUserButton =  document.getElementById('footer-save-button');
const cancelButton = document.getElementById('footer-cancel-button');

saveUserButton.addEventListener ('click', (e) => {
    e.preventDefault();
    const arrayOfFormInputs = document.querySelectorAll('form div input');
    
    let isEmptyValues = false;

    for (let i = 0; i < arrayOfFormInputs.length; ++i) {
        if (!arrayOfFormInputs[i].value) {
            isEmptyValues = true;
        }
    }
    if (!isEmptyValues) {
            const newUser = {
            email: arrayOfFormInputs[0].value, 
            firstname: arrayOfFormInputs[1].value,
            lastname: arrayOfFormInputs[2].value,
            office: arrayOfFormInputs[3].value,
            birthdate: arrayOfFormInputs[4].value,
            password: arrayOfFormInputs[5].value
        };   
        ipcRenderer.send('creating-new-user-event', newUser);
    }

});

ipcRenderer.on('user-already-created', (data) => {
    const modal = document.querySelector('.modal');
    document.getElementById('modal-text-header').innerText = 'Error!';
    document.getElementById('modal-text-content').innerText = 'This user already exists';
    const instance = M.Modal.init(modal);
    instance.open();
});

ipcRenderer.on('user-successfully-created', (data) => {
    const modal = document.querySelector('.modal');
    document.getElementById('modal-text-header').innerText = 'Information!';
    document.getElementById('modal-text-content').innerText = 'User was successfully created!';
    const instance = M.Modal.init(modal);
    instance.open();
});

document.querySelector('#modal1 div a').addEventListener('click', (e) => {
    e.preventDefault();
    ipcRenderer.send('close-AddUserWindow-after-userCreated', {closeWindow: true});
});

cancelButton.addEventListener ('click', (e) => {
    e.preventDefault();
    ipcRenderer.send('close-adding-new-user-event', {closeAddWindow: true});
});