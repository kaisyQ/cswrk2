const {ipcRenderer} = require('electron');

ipcRenderer.on('user-information-event', (e, user) => {
    document.querySelector('.header-greetings').innerText = `Hi ${user.firstname}, Welcome to AMONIC Airlines.`;
    document.querySelector('.header-information-time').innerText = `Time spend on system: ${user.birthdate}.`;
    document.querySelector('.header-information-countoflogouts').innerText = `Number of crashes: 0`;
});
