import { app, BrowserWindow, dialog } from "electron";
import path from "node:path";
import { electronApp, optimizer } from "@electron-toolkit/utils";
import NFC from "../utils/nfc.mjs";

const isDev = !app.isPackaged;
let mainWindow;
let resourcesDir = isDev
  ? path.join(__dirname, "../")
  : path.join(__dirname, "../../../out");
const renderPath = path.join(resourcesDir, isDev ? "." : "..", "/renderer");

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 900,
    height: 670,
    show: false,
    // fullscreenable: true,
    // fullscreen: true,
    skipTaskbar: true,
    autoHideMenuBar: true,
    webPreferences: {
      preload: path.join(__dirname, "../", "/preload/preload.js"),
      devTools: true,
      sandbox: false,
    },
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

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});
