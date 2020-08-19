const electron = require('electron');
const { app, BrowserWindow } = require('electron');
const isDev = require('electron-is-dev');
const path = require('path');
let mainWindow;
require('./ipcHandlers')()
require('./store')()

function createWindow() {
    mainWindow = new BrowserWindow({
        show: false,
        maximize: true,
        webPreferences: {
            nodeIntegration: true
        }
    });
    mainWindow.maximize();
    const startURL = isDev ? 'http://localhost:3000' : `file://${path.join(__dirname, '../build/index.html')}`;

    mainWindow.loadURL(startURL);

    mainWindow.once('ready-to-show', () => mainWindow.show());
    mainWindow.on('closed', () => {
        mainWindow = null;
    });
}
app.on('ready', createWindow);
