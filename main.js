const path = require('path');

// Если не будет устанавливаться electron
// Необходимо понизить версию npm до 6
// Команда для понижения версии npm : npm install -g npm@6

// Для запуска приложения используйте команду : npm start

const { app, BrowserWindow, electronSend } = require('electron');

function createWindow () {
    const win = new BrowserWindow({
      width: 800,
      height: 600,
      webPreferences: {
        preload: path.join(__dirname, 'preload.js')
      }
    });
  
    win.loadFile(path.join(__dirname, 'windows/authWindow/index.html'));
    win.webContents.openDevTools();
}

const Main = async () => {
  await app.whenReady();
  createWindow();
}

app.on('window-all-closed', () => {
  app.quit()
})
const {ipcMain} = require('electron')

ipcMain.on('asynchronous-message', (event, arg) => {
  console.log( arg );
  
  // send message to index.html
  event.sender.send('asynchronous-reply', 'hello' );
  });
Main()