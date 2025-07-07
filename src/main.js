import { createApp } from 'vue'
import router from './router'
import './style.css'
import App from './App.vue'

const app = createApp(App)
app.use(router)
app.mount('#app')

// Electron IPC handling (if needed)
if (window.electronAPI) {
  console.log('Electron API available')
} else if (window.ipcRenderer) {
  window.ipcRenderer.on('main-process-message', (_event, message) => {
    console.log(message)
  })
} else {
  console.log('Running in browser mode')
}