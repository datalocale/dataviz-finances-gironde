# Nouveau CA

Ce document décrit les actions à effectuer pour mettre à jour la visualisation publique.

1. Mettre le fichier xml du nouveau CA dans `data/finances/CA`
2. Mettre le bon plan de compte dans `data/finances/planDeComptes`. On trouve typiquement ces fichiers dans le dossier en ligne : <http://odm-budgetaire.org/composants/normes/>
3. Modifier le tableau lignes 40-44 du fichier `tools/make-public-data.js` pour qu'il liste seulement les CA souhaités dans la dataviz
4. Modifier le tableau lignes 15-19 du fichier `tools/make-public-data.js` pour qu'il liste seulement les fichiers de plans de compte souhaités
5. Modifier les lignes 103 et 104 du fichier `src/public/js/main.js` pour mettre l'année la plus récente