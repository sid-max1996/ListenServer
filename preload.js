const { ipcRenderer } = require('electron')

ipcRenderer.on('server-query', (e, params) => {
  console.log('server-query params', params)
  const { method, body, query, path, headers } = params
  const queryMessageElem = document.getElementById('query-message')
  queryMessageElem.style.visibility = 'visible'
  document.getElementById('method').innerHTML = `МЕТОД: ${method}`
  document.getElementById('path').innerHTML = `ПУТЬ: ${path}`
  document.getElementById('query').innerHTML = `ПАРАМЕТРЫ: ${JSON.stringify(query)}`
  document.getElementById('body').innerHTML = `ТЕЛО: ${JSON.stringify(body)}`
  document.getElementById('headers').innerHTML = `ЗАГОЛОВКИ: ${JSON.stringify(headers)}`
})

window.addEventListener('DOMContentLoaded', () => {
  const runBtn = document.getElementById('run-btn')
  runBtn.onclick = (e) => {
    const messageElem = document.getElementById('message')
    const portValue = document.getElementById('port-input').value
    ipcRenderer.invoke('run-server', portValue).then((res) => {
      if (res.isSuccess) {
        runBtn.disabled = true
        messageElem.innerHTML = `Cервер запущен по адресу: ${res.serverAddr}`
        messageElem.style.visibility = 'visible'
        messageElem.classList.add('alert-secondary')
      } else {
        messageElem.innerHTML = 'Ошибка запуска сервера'
        messageElem.style.visibility = 'visible'
        messageElem.classList.add('alert-warning')
      }
    })
  }
})
