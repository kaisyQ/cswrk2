const electron = require('electron');
const url = require('url');
const path = require('path');

const UserCheck = require('./Auth/auth');
const TakeUserInfo = require('./Auth/takeUserInfo');
const GetAllUsersInfo = require('./Auth/GetAllUsers');
const AddUser = require('./Auth/addUser');

const app = electron.app;
const BrowserWindow = electron.BrowserWindow;
const ipcMain = electron.ipcMain;
const Menu = electron.Menu;


let AuthWindow;
let DefaultUserWindow;
let AdminWindow;
let AddUserWindow;

const DefaultUserMenuTemplate = [
    {
        label: 'Exit', 
        click () {
            app.quit();
        } 
    }
];

const AdminMenuTemplate = [
    {
        label: 'Add user',
        click () {
            if (!AddUserWindow) {
                AddUserWindow = new BrowserWindow({width: 500, height: 700});
                AddUserWindow.setMenuBarVisibility(false);
                AddUserWindow.loadURL(url.format({
                    pathname: path.join(__dirname, 'windows/AddUserWindow/index.html'),
                    protocol: 'file:',
                    slashes: true
                }));
                
                AddUserWindow.on('closed', () => {
                    AddUserWindow = null;
                });
                
        
            }
        }
    }, 
    {
        label: 'Exit', 
        click () {
            app.quit();
        }
    }
];

ipcMain.on('login-user-event', async (e, user) => {
    
    const usercheck = await UserCheck({username: user.username, password: user.password});

    if (usercheck) {
        const userinfo = await TakeUserInfo(user.username);

        if (userinfo.role_ === require('./Auth/roles').Admin) {
            if (!AdminWindow) {
                AdminWindow = new BrowserWindow({});
                const adminMenu = Menu.buildFromTemplate(AdminMenuTemplate);
                AdminWindow.setMenu(adminMenu); 
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
            }
        } else {
            if (!DefaultUserWindow) {
                DefaultUserWindow = new BrowserWindow({});
                const defaulUserMenu = Menu.buildFromTemplate(DefaultUserMenuTemplate);
                DefaultUserWindow.setMenu(defaulUserMenu);
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

ipcMain.on ('creating-new-user-event', async (e, user) => {
    const con = UserCheck(user.email);

    if(con) {
        //.. Сказать что юзер уже существует 
    } else {
        AddUser(user)
    }

});
  
app.on('ready', () => {
    AuthWindow = new BrowserWindow({});
    AuthWindow.loadURL(url.format({
        pathname: path.join(__dirname, 'windows/AuthWindow/index.html'),
        protocol: 'file:',
        slashes: true
    }));
    AuthWindow.setMenuBarVisibility(false);
    AuthWindow.on('closed', () => {
        AuthWindow = null;
    });
})
