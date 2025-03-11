import { contextBridge, ipcRenderer } from "electron";
import { electronAPI } from "@electron-toolkit/preload";

// Custom APIs for renderer
const api = {
  // Réception des tags NFC
  tagData: (callback) => ipcRenderer.on("tagData", callback),

  // Envoi d'événements au process principal (ex: ouvrir le clavier OSK)
  send: (channel, data) => ipcRenderer.send(channel, data)
};

// Exposer l'API au renderer
if (process.contextIsolated) {
  try {
    contextBridge.exposeInMainWorld("electron", electronAPI);
    contextBridge.exposeInMainWorld("api", api); // 🔥 Ajout de send()
  } catch (error) {
    console.error(error);
  }
} else {
  // @ts-ignore (define in dts)
  window.electron = electronAPI;
  // @ts-ignore (define in dts)
  window.api = api;
}
