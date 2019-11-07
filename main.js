const { app, BrowserWindow, ipcMain } = require('electron')
const path = require('path')
const ip = require('ip')

const express = require('express')
const bodyParser = require('body-parser')
const expressApp = express()
const cors = require('cors')
const server = require('http').createServer(expressApp)

expressApp.use(cors())

expressApp.use(bodyParser.urlencoded({ extended: false }))
expressApp.use(bodyParser.json())
expressApp.use(bodyParser.raw())
expressApp.use(bodyParser.text())

let mainWindow

function createWindow () {
  mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    autoHideMenuBar: true,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js')
    }
  })

  mainWindow.loadFile('index.html')

  mainWindow.on('closed', function () {
    mainWindow = null
  })
}

app.on('ready', createWindow)

app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') app.quit()
})

app.on('activate', function () {
  if (mainWindow === null) createWindow()
})

expressApp.use(function (req, res, next) {
  console.log('req')
  const { method, body, query, path, headers } = req
  const params = { method, body, query, path, headers }
  console.log('params', params)
  mainWindow.webContents.send('server-query', params)
  res.sendStatus(200)
})

function runServer (port) {
  return new Promise((resolve) => {
    server.listen(port, err => {
      if (err) resolve({ isSuccess: false })
      else {
        resolve({
          isSuccess: true,
          serverAddr: `http://${ip.address()}:${port}`
        })
      }
    })
  })
}

ipcMain.handle('run-server', async (event, port) => {
  const result = await runServer(port)
  return result
})
