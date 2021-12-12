const electron = require('electron');
const url = require('url');
const path = require('path');

const UserCheck = require('./Auth/auth');
const TakeUserInfo = require('./Auth/takeUserInfo');
const GetAllUsersInfo = require('./Auth/GetAllUsers');
const AddUser = require('./Auth/addUser');
const UserTime = require('./Auth/enterTime');

const app = electron.app;
const BrowserWindow = electron.BrowserWindow;
const ipcMain = electron.ipcMain;
const Menu = electron.Menu;


let AuthWindow;
let DefaultUserWindow;
let AdminWindow;
let AddUserWindow;
let ChangeRoleWindow;
let NoLogoutWindow;
 
let CurrentUser;

const DefaultUserMenuTemplate = [
    {
        label: 'Exit', 
        async click () {
            const UserTimeInfo = await UserTime.GetUserTimeInfo({id: CurrentUser.id});
            await UserTime.AddExitTime(UserTimeInfo[UserTimeInfo.length - 1].id);
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
    
    const usercheck = await UserCheck({email: user.email, password: user.password});
    if (usercheck) {
        const userinfo = await TakeUserInfo(user.email);
        CurrentUser = userinfo;
        
        if (await require('./Auth/getUserRole')(user.email) === require('./Auth/roles').Admin) {
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
            const lastUserExitInfo = await UserTime.GetUserTimeInfo({id: userinfo.id});

            if (lastUserExitInfo[lastUserExitInfo.length - 1].exit_time) {
                if (!DefaultUserWindow) {
                    await UserTime.AddEnterTime({id: userinfo.id});
                    DefaultUserWindow = new BrowserWindow({});
                    const defaulUserMenu = Menu.buildFromTemplate(DefaultUserMenuTemplate);
                    DefaultUserWindow.setMenu(defaulUserMenu);
                    AuthWindow.close();
                    DefaultUserWindow.loadURL(url.format({
                            pathname: path.join(__dirname, 'windows/DefaultUserWindow/index.html'),
                            protocol: 'file:',
                            slashes: true
                    }));
                    DefaultUserWindow.webContents.on('did-finish-load', async () => {
                        DefaultUserWindow.webContents.send('user-information-event', {userinfo: userinfo, timeinfo: await UserTime.GetUserTimeInfo({id: userinfo.id})});
                    });
                }
            } else {
                NoLogoutWindow = new BrowserWindow({});
                AuthWindow.close();
                NoLogoutWindow.loadURL(url.format({
                        pathname: path.join(__dirname, 'windows/NoLogoutWindow/index.html'),
                        protocol: 'file:',
                        slashes: true
                }));
                NoLogoutWindow.webContents.on('did-finish-load', () => {
                    NoLogoutWindow.webContents.send('last-uncsc-logout', {lastLog: lastUserExitInfo[lastUserExitInfo.length - 1]});
                });
            }

        }
    } else {
        AuthWindow.webContents.send('not-correct-user', user);
    }
});


ipcMain.on ('creating-new-user-event', async (e, user) => {
    const con = await UserCheck(user);
    if(con) {
        AddUserWindow.webContents.send('user-already-created', {isCreated: true});
    } else {
        try {
            await AddUser(user);
            console.log(`User : \n ${user} \n was successfully created`);
            AddUserWindow.webContents.send('user-successfully-created', {isCreated: true, user: user});
        } catch (err) {
            console.error(err);
        }
    }

});

ipcMain.on('take-data-from-database-event', async (data) => {
    AdminWindow.webContents.send('admin-window-data-from-db', {currentUser: CurrentUser, arrayOfAllUsers: await GetAllUsersInfo()});
});

ipcMain.on('interval-update', async () => {
    AdminWindow.webContents.send('update-AdminWindow', {isUpdated: false, currentUser: CurrentUser, arrayOfAllUsers: await GetAllUsersInfo()});
})

ipcMain.on('close-AddUserWindow-after-userCreated', async (data) => {
    AddUserWindow.close();
    AddUserWindow = null;
    AdminWindow.webContents.send('update-AdminWindow', {isUpdated: false, currentUser: CurrentUser, arrayOfAllUsers: await GetAllUsersInfo()});
});

ipcMain.on('admin-changerole-event', (e, data) => {
    if(!ChangeRoleWindow) {
        ChangeRoleWindow = new BrowserWindow({width: 500, height: 700});
        ChangeRoleWindow.loadURL(url.format({
            pathname: path.join(__dirname, 'windows/ChangeRoleWindow/index.html'),
            protocol: 'file:',
            slashes: true
        }));
        ChangeRoleWindow.setMenuBarVisibility(false);

        ChangeRoleWindow.on('closed', () => {
            ChangeRoleWindow = null;
        });
    }
});

ipcMain.on('cancel-changerole-event', (e, data) => {
    ChangeRoleWindow.close();
    ChangeRoleWindow = null;
});

ipcMain.on('user-update-event', async (e, data) => {
    const usercheck = await TakeUserInfo(data.user[0]);
    if(usercheck) {
        if(require('./Auth/getUserRole')(data.user[0]) === require('./Auth/roles').Admin) {
            ChangeRoleWindow.webContents.send('AdminRole-update');
        } else {
            const updateUser = await require('./Auth/updateUser')(data.user[0]);
            if (updateUser) {
                ChangeRoleWindow.webContents.send('user-successfully-updated');
            } else {
                ChangeRoleWindow.webContents.send('bad-update');
            }
        }

    } else {
        ChangeRoleWindow.webContents.send('user-not-found');
    }
});

ipcMain.on('logout-reason', async (e, data) => {
    const lastUserExitInfo = await UserTime.GetUserTimeInfo({id: CurrentUser.id});
    await UserTime.updateLogReason({id: lastUserExitInfo[lastUserExitInfo.length - 1].id, logReason: data.logReason});
    if (!DefaultUserWindow) {
        await UserTime.AddEnterTime({id: CurrentUser.id});
        DefaultUserWindow = new BrowserWindow({});
        const defaulUserMenu = Menu.buildFromTemplate(DefaultUserMenuTemplate);
        DefaultUserWindow.setMenu(defaulUserMenu);
        DefaultUserWindow.loadURL(url.format({
                pathname: path.join(__dirname, 'windows/DefaultUserWindow/index.html'),
                protocol: 'file:',
                slashes: true
        }));
        DefaultUserWindow.webContents.on('did-finish-load', async () => {
            DefaultUserWindow.webContents.send('user-information-event', {userinfo: CurrentUser, timeinfo: await UserTime.GetUserTimeInfo({id: CurrentUser.id})});
        });
        NoLogoutWindow.close();
        NoLogoutWindow = null;
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
