# Courvoisier-Malherbe-NFC

## Project Setup

### Install

```bash
$  npm  install
```

After installing, please run (if it doesn't automatically)

MacOS :

```bash
$  npm  run  rebuild
```

Win :

```bash
$  .\node_modules\.bin\electron-rebuild.cmd
```

### Development

```bash
$  npm  run  start
```

### Build

Before building, make sure you run

```bash
$  npm  install
```

```bash
# For windows
$  npm  run  build:win
# en cas d'erreur :
$  npm  run  build
# puis
./node_modules/.bin/electron-builder  --win

# For macOS
$  npm  run  build:mac

# For Linux
$  npm  run  build:linux
```

## Informations Pratiques

Le fichier `tags.json` est organisé selon la structure suivante :
```plaintext
📂 Root
├── (Product ID) 1
│   ├── description: "Product 1 Tags"
│   └── TagsID
│       └── [X,X,X,X,X]
|		    └── [X,X,X,X,X]
|		    ...
```
Un même tag ne peut pas être associé à deux produits différents.
Pour connaître l'ID d'un tag NFC, il suffit de le passer sur le lecteur. Son ID s'affichera alors en haut de l'écran, indiquant l'éventuel produit lui étant associé.

## Erreurs Fréquentes

- "electron-builder [not recognized as command]" : essayer de lancer `.\node_modules\.bin\electron-builder`. Si erreur 'Running scripts disabled on this system', voir : [Error Running scripts disabled on this system](https://lazyadmin.nl/powershell/running-scripts-is-disabled-on-this-system/)

- "failed ERR_ELECTRON_BUILDER_CANNOT_EXECUTE" : erreur d'exécution, relancer la commande règle souvent le problème.

- Erreur mentionnant "node-gyp" et python : [StackOverflow](https://stackoverflow.com/a/70799513/20257981)

- run `npm config get python`:

- si "undefined", Python n'est pas installé, ou le chemin de l'exe python est mal configuré. Cherchez le dossier d'installation de python avec `where python`. Si la version de python est supérieure à 3, `npm config set python CHEMIN_OBTENU_AVEC_WHERE_PYTHON`

- si le chemin indiqué pointe vers un executable qui n'existe plus, même solution qu'au dessus

- si le chemin est correct et pointe vers une version de python supérieure à 3, tester les autres solutions proposées.

## PERSONNALISER L'EXECUTABLE

Des customisations peuvent être faites dans le fichier package.json. Celles-ci sont valables lors de l'utilisation d'electron-builder

- Le nom de l'application peut être modifiée à l'encart `productName`

- L'icône peut être modifiée à l'encart `mac/win > icon`

Placez l'icône souhaitée n'importe où et indiquez son chemin

- Le développeur peut être modifié à l'encart `author`. Son nom sera visible dans le gestionnaire de programmes Windows et sur MacOS.

- La description peut-être modifiée l'encart `description`.

- L'ID de l'application peut également être modifié à l'encart ``appID``` (il est utile dans le cas où plusieurs installations de l'application devraient être faites, entre autres)