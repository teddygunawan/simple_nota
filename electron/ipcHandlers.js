const electron = require('electron');
const { app, BrowserWindow } = require('electron');
const path = require('path');
const fs = require('fs');
const Store = require('electron-store');
const ipc = electron.ipcMain;
const shell = electron.shell;
const store = new Store()
module.exports = function () {

    ipc.handle('save-products', (event, data) => {
        store.set('products', data.products)
        store.set('identities', data.identities)
        return true
    });
    ipc.handle('get-products', (event, params) => {
        let products = store.get('products')
        let identities = store.get('identities')
        return { products, identities }
    });

    ipc.handle('print-to-pdf', (event) => {
        console.log("printing")

        let directory = 'D:/nota'
        if (!fs.existsSync(directory)) {
            fs.mkdirSync(directory);
        }
        let dateString = new Date().toISOString()
        let dateNow = dateString.slice(0, 10)
        let timeNow = dateString.slice(11, 19).replace(new RegExp(':', 'g'), ";")
        let fileName = `${dateNow} ${timeNow}.pdf`;

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
    });
}