import { app, BrowserWindow, globalShortcut } from "electron";
import path from "node:path";
import { electronApp, optimizer } from "@electron-toolkit/utils";
import NFC from "../utils/nfc.mjs";

import { ipcMain } from "electron";
import { exec } from "child_process";

// Écouteur pour ouvrir le clavier OSK
ipcMain.on("open-keyboard", () => {
  console.log("⌨️ Commande reçue dans main.js : ouverture du clavier OSK");

  if (mainWindow) {
    mainWindow.webContents.executeJavaScript(`
    console.log("⌨️ [MAIN] Commande reçue dans main.js : ouverture du clavier OSK");
  `);
  }

  exec('"C:\\Windows\\System32\\osk.exe"', (error) => {
    if (error) {
      console.error("❌ Erreur lors de l'ouverture du clavier :", error);
    } else {
      console.log("✅ Clavier OSK lancé avec succès !");
    }
  });
});
console.log("🟢 Écouteur `ipcMain.on('open-keyboard')` actif !");

const isDev = !app.isPackaged;
let mainWindow;
let resourcesDir = isDev
  ? path.join(__dirname, "../")
  : path.join(__dirname, "../../../out");
const renderPath = path.join(resourcesDir, isDev ? "." : "..", "/renderer");

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1080 / 2,
    height: 1920 / 2,
    show: false,
    fullscreenable: true,
    fullscreen: true,
    skipTaskbar: true,
    autoHideMenuBar: !isDev, // Cache le menu seulement en production
    webPreferences: {
      enableRemoteModule: true,
      preload: path.join(__dirname, "../", "/preload/preload.js"),
      devTools: true,
      sandbox: false,
    },
  });

  mainWindow.loadFile("./dist/index.html");

  
  mainWindow.setMenuBarVisibility(false); //test

  globalShortcut.register("f", () => {
    mainWindow.setFullScreen(!mainWindow.isFullScreen());
  });

  globalShortcut.register("e", () => {
    mainWindow.close();
  });

  mainWindow.on("ready-to-show", () => {
    mainWindow.show();
  });

  mainWindow.loadFile(path.join(renderPath, "/index.html"));
}

app.whenReady().then(() => {
  electronApp.setAppUserModelId("com.electron");

  createWindow();

  app.on("browser-window-created", (_, window) => {
    optimizer.watchWindowShortcuts(window);
  });

  NFC.handleInputs();

  NFC.on("tagDetected", (tagData) => {
    console.log("Sending detected tag to renderer:", tagData);
    mainWindow.webContents.send("tagData", tagData);
  });
});

console.log("🚀 main.js est bien exécuté !");

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});
