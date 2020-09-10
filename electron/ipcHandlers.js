const electron = require("electron")
const { BrowserWindow } = require("electron")
const path = require("path")
const fs = require("fs")

const { ipcMain, shell } = electron
const db = require("./db")

module.exports = function ipcHandlers() {
  ipcMain.handle("save-products", (event, { newProducts, changedProducts, deletedProducts }) => {
    db.products.insert(newProducts)
    changedProducts.forEach((product) => {
      const updatedProduct = {
        name: product.name,
        price: product.price,
        unit: product.unit,
      }
      db.products.update({ _id: product._id }, { ...updatedProduct })
    })
    deletedProducts.forEach((product) => {
      db.products.remove({ _id: product._id })
    })
    return true
  })

  ipcMain.handle("get-products", async () => {
    const products = await db.products.find({}).sort({ name: 1 })
    return products
  })

  ipcMain.handle("save-transaction", (event, { customer, products }) => {
    const transaction = {
      customer,
      products,
    }

    db.transactions.insert(transaction)
  })

  ipcMain.handle("print-to-pdf", (event) => {
    const directory = "D:/nota"
    if (!fs.existsSync(directory)) {
      fs.mkdirSync(directory)
    }
    const dateString = new Date().toISOString()
    const dateNow = dateString.slice(0, 10)
    const timeNow = dateString.slice(11, 19).replace(new RegExp(":", "g"), ";")
    const fileName = `${dateNow} ${timeNow}.pdf`
    const pdfPath = path.join(directory, fileName)
    const win = BrowserWindow.fromWebContents(event.sender)
    const options = {
      marginsType: 1,
      pageSize: "A4",
      printBackground: true,
      printSelectionOnly: false,
      landscape: true,
    }
    win.webContents
      .printToPDF({ options })
      .then((data) => {
        fs.writeFile(pdfPath, data, (error) => {
          if (error) throw error
          shell.openExternal(`file://${pdfPath}`)
        })
      })
      .catch((error) => error)
  })
}
