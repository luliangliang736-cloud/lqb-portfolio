import { contextBridge, ipcRenderer } from 'electron';

contextBridge.exposeInMainWorld('desktopBridge', {
  openMainApp: () => ipcRenderer.invoke('desktop:open-main-app'),
  closeCompanion: () => ipcRenderer.invoke('desktop:close-companion'),
  dictate: (timeoutSeconds) => ipcRenderer.invoke('desktop:dictate', timeoutSeconds),
});
