const config = {
  npmRebuild: "false",
  appId: "com.courvoisier.app",
  files: [
    "./out/main/main.js",
    "./out/preload/preload.js",
    "./utils//*",
    "node_modules//*",
  ],
  extraResources: [
    "config.json",
    "tags.json",
    {
      from: "out/renderer/",
      to: "renderer",
    },
  ],
  mac: {
    icon: "./resources/icon.png",
    target: "dmg",
  },
  win: {
    icon: "./resources/icon.png",
    target: "nsis",
  },
  nsis: {
    unicode: false,
    installerIcon: "./resources/icon.ico",
    artifactName: "Courvoisier_NFC.exe",
  },
  dmg: {
    title: "Courvoisier_NFC",
  },
};

module.exports = config;
