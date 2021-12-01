const electron = require('electron');
const url = require('url');
const path = require('path');

const UserCheck = require('./Auth/auth');
const TakeUserInfo = require('./Auth/takeUserInfo');
const GetAllUsersInfo = require('./Auth/GetAllUsers')

const app = electron.app;
const BrowserWindow = electron.BrowserWindow;
const ipcMain = electron.ipcMain;


let AuthWindow;
let DefaultUserWindow;
let AdminWindow;

ipcMain.on('login-user-event', async (e, user) => {
    
    const usercheck = await UserCheck({username: user.username, password: user.password});

    if (usercheck) {
        const userinfo = await TakeUserInfo(user.username);

        if (userinfo.role_ === require('./Auth/roles').Admin) {
            AdminWindow = new BrowserWindow({});
            AuthWindow.close();
            AdminWindow.loadURL(url.format({
                pathname: path.join(__dirname, 'windows/AdminWindow/index.html'),
                protocol: 'file:',
                slashes: true
            }));
            AdminWindow.webContents.on('did-finish-load', async () => {
                    const allUsersInfo = await GetAllUsersInfo();
                    AdminWindow.webContents.send('send-all-users-info-event', {
                        arrayOfAllUsers: allUsersInfo,
                        currentUser: userinfo
                    });
            });
        } else {
            if (!DefaultUserWindow) {
                DefaultUserWindow = new BrowserWindow({});
                AuthWindow.close();
                DefaultUserWindow.loadURL(url.format({
                        pathname: path.join(__dirname, 'windows/DefaultUserWindow/index.html'),
                        protocol: 'file:',
                        slashes: true
                }));
                DefaultUserWindow.webContents.on('did-finish-load', () => {
                    DefaultUserWindow.webContents.send('user-information-event', userinfo);
                });
            }
        }
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
        AuthWindow = null;
    });


})
