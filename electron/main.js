const electron = require('electron');
const { app, BrowserWindow } = require('electron');
const isDev = require('electron-is-dev');
const path = require('path');
const fs = require('fs');
const ipc = electron.ipcMain;
const shell = electron.shell;
let mainWindow;

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

ipc.handle('save-products', (event, data) => {
    try {
        fs.writeFileSync(__dirname + '/json_data/products.json', JSON.stringify(data.products));
        fs.writeFileSync(__dirname + '/json_data/identities.json', JSON.stringify(data.identities));
    } catch (err) {
        console.log(err)
    }
    return true
});
ipc.handle('get-products', (event, params) => {
    let products = JSON.parse(fs.readFileSync(__dirname + '/json_data/products.json'));
    let identities = JSON.parse(fs.readFileSync(__dirname + '/json_data/identities.json'));
    return { products, identities }
});

ipc.on('print-to-pdf', (event) => {
    console.log("printing")

    let directory = 'D:/nota'
    if (!fs.existsSync(directory)) {
        fs.mkdirSync(directory);
    }
    var dt = new Date().toISOString().slice(0, 10)
    let fileName = dt + '.pdf';

    const pdfPath = path.join(directory, fileName);
    const win = BrowserWindow.fromWebContents(event.sender);
    var options = {
        marginsType: 1,
        pageSize: 'A4',
        printBackground: true,
        printSelectionOnly: false,
        landscape: true
    };
    win.webContents.printToPDF({ options }).then(data => {
        fs.writeFile(pdfPath, data, (error) => {
            if (error) throw error
            shell.openExternal('file://' + pdfPath);
            console.log('Write PDF successfully.')
        })
    }).catch(error => {
        console.log(error)
    })
    // win.webContents.printToPDF(options, (error, data) => {
    //     if (error) throw error;

    //     fs.writeFile(pdfPath, data, err => {
    //         if (err) return console.log(err.message);
    //         shell.openExternal('file://' + pdfPath);
    //         event.sender.send('wrote-pdf', pdfPath);
    //     })
    // });
});