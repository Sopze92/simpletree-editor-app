const { app, BrowserWindow, ipcMain } = require('electron')
const path = require('node:path')

// vite runtime init error fix
import started from 'electron-squirrel-startup'
if (started) app.quit()

const createWindow = () => {
  const mainWindow = new BrowserWindow({
    width: 1280, height: 720,
    minWidth: 480, minHeight: 512,
    frame: false,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
    },
  })

  if (MAIN_WINDOW_VITE_DEV_SERVER_URL) mainWindow.loadURL(MAIN_WINDOW_VITE_DEV_SERVER_URL)
  else mainWindow.loadFile(path.join(__dirname, `../renderer/${MAIN_WINDOW_VITE_NAME}/index.html`))

  //mainWindow.removeMenu()
  mainWindow.webContents.openDevTools()
}

app.whenReady().then(() => {
  createWindow()

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })

  ipcMain.on('titlebar-event', (e, data)=>{

    const _window= BrowserWindow.fromWebContents (e.sender)

    switch(data.idx){
      case 0:
        if(_window.minimizable) _window.minimize()
          break;
      case 1:
        if(_window.maximizable){
          if(_window.isMaximized()) _window.unmaximize()
          else _window.maximize()
        }
        break;
      case 2:
        _window.close()
        break;
      case 3:
        _window.setPosition(data.pos[0], data.pos[1])
        break;
    }
  })
  
  ipcMain.on('menubar-event', (e, data)=>{
  })
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit()
})