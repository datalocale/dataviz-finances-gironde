# Dataviz finances Gironde

## Contribuer

Au vu du scope du projet et de sa spécificité franco-française, il est décidé que le *readme*, les *issues*, *pull requests* et messages de *commit* sont à écrire **en français**.

Le code et les commentaires sont à écrire **en anglais**.

## Compatibilité navigateur

Minima:

* IE11
* Edge
* Firefox
* Chrome
* navigateurs mobiles


## Installer le projet

L'installation de [`node@>=8`][nodejs] est nécessaire avant de continuer.

Il faut (_forker_ et) _cloner_ ce dépôt pour procéder à l'installation des dépendances du projet :

```bash
npm install
```

La commande suivante reconstruit les builds en continu, dès qu'un fichier source est modifié :

```bash
npm run watch
```

Enfin, les composants web sont visualisables dans un navigateur web :

```bash
npm start
```

Deux adresses sont ensuite accessibles : [http://localhost:3000/]() et [http://localhost:3000/public/]().

## Intégration continue

L'intégration continue est automatise les éléments suivants :

* exécution des tests sur _chaque branche_ ;
* déploiement de la [démo][] depuis _master_ ;

Le suivi des _builds_ est assuré par une github action


## Déploiement

**Remarque** : les étapes de la section `Installer le projet` doivent avoir été suivies au préalable.

Il existe 3 environnements :

* gironde.fr où il faut créer manuellement dans le CMS un "media dataviz" et un contenu de type "Code HTML5" où on peut mettre le contenu de `build/gironde-fr-integration.html`. Le fichier JavaScript `dataviz-finance-gironde-fr-bundle.script` est à ajouter indépendamment.
    * `npm run build-production` pour gironde.fr, la production (media id `2459`)
* démo sur gh-pages (`npm run build-demo:public` mais cette commande est seulement faite par github actions)
* dévelopement (`npm run watch`)

Les artéfacts de build sont rendus créés dans le dossier `./build`.

Github actions est [configuré](https://github.com/datalocale/dataviz-finances-gironde/blob/master/.github/workflows/publish.yml) pour builder automatiquement les artefacts des 2 environnements et les pousser sur les branches : 
- [`gh-pages`](https://github.com/datalocale/dataviz-finances-gironde/tree/gh-pages) pour l'environnement de [démo](https://datalocale.github.io/dataviz-finances-gironde/public/)
- [`gironde.fr`](https://github.com/datalocale/dataviz-finances-gironde/tree/gironde.fr) pour le déploiement en production sur [gironde.fr](https://www.gironde.fr/un-budget-au-service-des-solidarites-humaine-et-territoriale)



### Convertir l'image de fond de la page d'accueil

Cette action requiert [ImageMagick][] et est à effectuer à chaque fois que l'image `images/Map-v1.jpg` est mise à jour.

```bash
$ convert images/Map-v1.jpg -interlace Plane -resize 1300 -strip images/map-optimised.jpg
```
## Présentation de l'outil

L’outil créé est une application 100% front-end chargée à partir de fichiers statiques HTML, CSS, JS, images, etc. Cette application utilise la bibliothèque React.js.
Le code source de référence est actuellement sur github à l’adresse suivante : 
https://github.com/datalocale/dataviz-finances-gironde/


## mise à jour

Les actions nécessaires à la mise à jour des contenus sont de plusieurs nature : 

* mise à jour des labels finances
* mise à jour des données budgétaires
* mise à jour des règles d'agrégats
  
### mise à jour des labels finances

Actuellement les labels des articles de la norme comptable M52 sont stockés dans un fichier csv. Ce fichier est mis à disposition via l'outil google spreadsheet afin d'en faciliter l'édition collaborative.
En complément un fichier contient des textes conjoncturels permettant d'expliciter l'évolution d'une recette ou d'une dépense significative sur la période couverte par l'outil. Ce fichier est géré de la même manière que le fichier de définition.

https://docs.google.com/spreadsheets/d/1RQ6YAhFlFZaamvl6HpUxH_4MaG7Yg8l45pdTey14tOU/edit#gid=1852965930

### mise à jour des données budgétaires

Pour mettre à jour l'exercice budgétaire rendu visible dans la page d'accueil les étapes suivantes sont actuellement nécessaires


1. Mettre le fichier xml du nouveau CA dans data/finances/CA
2. Mettre le bon plan de compte dans data/finances/planDeComptes. On trouve typiquement ces fichiers dans le dossier en ligne : http://odm-budgetaire.org/composants/normes/. Il serait facile de faire un outil qui va chercher le bon fichier et le met dans le bon dossier tout seul genre npm run plan-de-compte
3. Modifier le tableau lignes 40-44 du fichier tools/make-public-data.js pour qu'il liste seulement les CA souhaités dans la dataviz. Le code pourrait lister tous les fichiers du dossier et tous les inclure, comme ça, pas besoin de les lister dans le code
4. Modifier le tableau lignes 15-19 du fichier tools/make-public-data.js pour qu'il liste seulement les fichiers de plans de compte souhaités. Le code pourrait lister tous les fichiers du dossier et tous les inclure, comme ça, pas besoin de les lister dans le code
5. Modifier les lignes 103 et 104 du fichier src/public/js/main.js pour mettre l'année la plus récente. Quand les données des CA arrivent côté client, on pourrait mettre à jour currentYear, explorationYear en trouvant l'année la plus récente qui existe dans les données. Comme ça, plus besoin de toucher à ce code

Par ailleurs la référence à la localisation de l'environnement de démo est listé dans ce fichier.
https://github.com/datalocale/dataviz-finances-seinesaintdenis/blob/master/src/public/js/constants/resources.js

Il faut le modifier si l'emplacement de l'environnement de démo est modifié.

### mise à jour des données d'agrégats

La dataviz finances est basé sur plusieurs éléments contribuant à son interopérabilité et à sa réutilisabilité :

* appui sur la norme comptable M52  et le plan de compte associé
* appui sur le schéma xsd TOTEM
* déploiement continu d'une SPA (Single page application) qui peut être intégré à n'importe quel type de publication (site web autonome, page dans un gestionnaire de contenu)

En plus des présentations par fonctions ou nature M52, le Département de la Gironde présente ses comptes sous un format dit “agrégé”. Ils s’agit d’une centaine de catégories. Il existe (à une petite exception près) une association qui permet de passer d’un document budgétaire en M52 à un document agrégé.

Pour faciliter la gestion actuelle, un tableur numérique collaboratif permet l'écriture des formules en langage métier

https://docs.google.com/spreadsheets/d/1vb9YLAcjjkW1QA5bkuOpYOmD9y34YHwJAcgzepnLXxw/edit#gid=568066882

Cette association est encodée en JavaScript dans les deux fichier suivants :

https://github.com/datalocale/dataviz-finances-gironde/blob/master/src/shared/js/finance/m52ToAggregated.js
https://github.com/datalocale/dataviz-finances-gironde/blob/master/src/shared/js/finance/hierarchicalAggregated.js

Par ailleurs, il a été découvert début octobre 2017 que dans de rares cas, un montant associé à une même ligne M52 (fonction/article) se découpe dans 2 agrégats différents. Pour résoudre ce cas, un fichier de “correction” a été ajouté. Il peut être trouvé ici : https://github.com/datalocale/dataviz-finances-gironde/blob/master/data/finances/corrections-agregation.csv 

Dans ce fichier CSV, chaque ligne correspond à l’assignation d’une ligne M52 à un agrégat pour un exercice donné


Pour réduire la charge de travail nécesaire, un prototype d'outil permettant de visualiser le résultat des formules a été développé

https://davidbruant.github.io/formule-doc-budg/

Avec quelques évolutions, il pourrait permettre d'enregistrer les formules saisies directement dans le code de l'application.

## éditorial

L’outil contient des pages dites “focus” qui permettent au Département de créer du contenu plus éditorialisé pour mettre en valeur ses actions et parler un peu moins de finance et un peu plus de l’action qui en découle.

## Licence

[MIT](LICENSE)

[nodejs]: https://nodejs.org/
[ImageMagick]: https://www.imagemagick.org/script/download.php
[démo]: https://datalocale.github.io/dataviz-finances-gironde/public/
