const { app, BrowserWindow } = require("electron")
const isDev = require("electron-is-dev")
const path = require("path")
require("./ipcHandlers")()

let mainWindow

function createWindow() {
  mainWindow = new BrowserWindow({
    show: false,
    maximize: true,
    webPreferences: {
      nodeIntegration: true,
    },
  })

  mainWindow.maximize()
  const startURL = isDev ? "http://localhost:3000" : `file://${path.join(__dirname, "../build/index.html")}`

  mainWindow.loadURL(startURL)

  mainWindow.once("ready-to-show", () => mainWindow.show())
  mainWindow.on("closed", () => {
    mainWindow = null
  })

  if (isDev) {
    const { default: installExtension, REACT_DEVELOPER_TOOLS, REDUX_DEVTOOLS } = require("electron-devtools-installer")
    app.whenReady().then(() => {
      installExtension([REDUX_DEVTOOLS, REACT_DEVELOPER_TOOLS])
        .then(mainWindow.webContents.openDevTools())
        .catch((error) => error)
    })
  }
}
app.on("ready", createWindow)
