import {join} from 'path';
import {writeFile}  from 'fs-extra';

import getPlansDeCompte from './shared/getPlansDeCompte.js'

const BUILD_FINANCE_DIR = './build/finances';
const PLANS_DE_COMPTE_DIR = './data/finances/plansDeCompte';

getPlansDeCompte(PLANS_DE_COMPTE_DIR)
.then(plansDeComptes => {
    const natureLabels = {}
    const fonctionLabels = {}

    for(const pc of plansDeComptes){
        const comptes = Array.from(pc.getElementsByTagName('Compte'));

        comptes.forEach(c => {
            const code = c.getAttribute('Code')

            if(!(code in natureLabels))
                natureLabels[code] = c.getAttribute('Libelle')
        })

        const fonctions = Array.from(pc.getElementsByTagName('RefFonc'));

        fonctions.forEach(c => {
            const code = c.getAttribute('Code')

            if(!(code in fonctionLabels))
                fonctionLabels[code] = c.getAttribute('Libelle')
        })
    }

    return {
        natureLabels,
        fonctionLabels
    }
})
.then( docBudgs => JSON.stringify(docBudgs, null, 2) )
.then(str => writeFile(join(BUILD_FINANCE_DIR, 'm52-strings.json'), str, {encoding: 'utf8'}))
.catch(err => console.error('make-doc-budg-strings', err))
