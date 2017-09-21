# Dataviz finances Gironde [![Build Status](https://travis-ci.org/dtc-innovation/dataviz-finances-gironde.svg?branch=master)](https://travis-ci.org/dtc-innovation/dataviz-finances-gironde)

## Contribuer

Au vu du scope du projet et de sa spécificité franco-française, il est décidé que le *readme*, les *issues*, *pull requests* et messages de *commit* sont à écrire **en français**.

Le code et les commentaires sont à écrire **en anglais**.

## Compatibilité navigateur

A priori, nous avons besoin que ça marche sur IE11 + Firefox 47.

## Développer sur sa machine

```bash
$ npm run watch
```

```bash
$ npm start
```

## Avant de déployer

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

[ImageMagick]: https://www.imagemagick.org/script/download.php
