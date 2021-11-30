const electron = require('electron');
const url = require('url');
const path = require('path');

const UserCheck = require('./Auth/auth');

const app = electron.app;
const BrowserWindow = electron.BrowserWindow;
const ipcMain = electron.ipcMain;


let AuthWindow;

ipcMain.on('login-user-event', (e, user) => {
    if (UserCheck({username: user.username, password: user.password})) {
    //...   
    } else {
        AuthWindow.webContents.send('not-correct-user', user);
    }
});

app.on('ready', () => {
    AuthWindow = new BrowserWindow({});

    AuthWindow.loadURL(url.format({
        pathname: path.join(__dirname, 'windows/AuthWindow/index.html'),
        protocol: 'file:',
        slashes: true
    }));

    AuthWindow.on('closed', () => {
        app.quit();
    });


})
