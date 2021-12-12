const {ipcRenderer} = require('electron');

ipcRenderer.on('last-uncsc-logout', (e, data) => {
    const h3 = document.querySelector('h3');
    const dateArr = data.lastLog._date.split('T')[0].split('-');
    h3.innerText += ` ${dateArr[0]}/${dateArr[1]}/${parseInt(dateArr[2])+1} at ${data.lastLog.entry_time}`
});

document.querySelector('Button').addEventListener('click', (e) => {
    e.preventDefault();
    ipcRenderer.send('logout-reason', {logReason: document.querySelector('textarea').value});
    
});