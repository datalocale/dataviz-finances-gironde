# Dataviz finances Gironde [![Build Status](https://travis-ci.org/dtc-innovation/dataviz-finances-gironde.svg?branch=master)](https://travis-ci.org/dtc-innovation/dataviz-finances-gironde)

## Contribuer

Au vu du scope du projet et de sa spécificité franco-française, il est décidé que le *readme*, les *issues*, *pull requests* et messages de *commit* sont à écrire **en français**.

Le code et les commentaires sont à écrire **en anglais**.

## Compatibilité navigateur

A priori, nous avons besoin que ça marche sur IE11 + Firefox 47.

## Installer le projet

L'installation de [`node@>=6`][nodejs] est nécessaire avant de continuer.

Il faut (_forker_ et) _cloner_ ce dépôt pour procéder à l'installation des dépendances du projet :

```bash
$ npm install
```

La commande suivante reconstruit les builds en continu, dès qu'un fichier source est modifié :

```bash
$ npm run watch
```

Enfin, les composants web sont visualisables dans un navigateur web :

```bash
$ npm start
```

Deux adresses sont ensuite accessibles : [http://localhost:3000/]() et [http://localhost:3000/public/]().

## Avant de déployer

**Remarque** : les étapes de la section `Installer le projet` doivent avoir été suivies au préalable.

Les artéfacts de build sont rendus disponibles dans `./build`.

### Créer le build applicatif

Pour déployer sur le site `gironde.fr` :

```bash
$ npm run build
```

Pour déployer sur GitHub Pages :

```bash
$ npm run build-demo
```

### Convertir l'image de fond de la page d'accueil

Cette action requiert [ImageMagick][] et est à effectuer à chaque fois que l'image `images/Map-v1.jpg` est mise à jour.

```bash
$ convert images/Map-v1.jpg -interlace Plane -resize 1300 -strip images/map-optimised.jpg
```

## Licence

[MIT](LICENSE)

[nodejs]: https://nodejs.org/
[ImageMagick]: https://www.imagemagick.org/script/download.php
