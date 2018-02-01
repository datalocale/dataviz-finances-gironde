import {join} from 'path';
import * as fs from 'fs-extra';
import xmlBufferToString from 'xml-buffer-tostring';
import {DOMParser} from 'xmldom';

const {readFile, writeFile} = fs;

const BUILD_FINANCE_DIR = './build/finances';
const SOURCE_FINANCE_DIR = './data/finances/plansDeCompte';

Promise.all([
    'planDeCompte-2013.xml',
    'planDeCompte-2014.xml',
    'planDeCompte-2015.xml',
    'planDeCompte-2016.xml',
    'planDeCompte-2017.xml'
].map(f => {
    return readFile(join(SOURCE_FINANCE_DIR, f))
    .then(xmlBufferToString)
    .then( str => {
        return (new DOMParser()).parseFromString(str, "text/xml");
    })
}))
.then(plansDeComptes => {

    // sort with most recent years first
    plansDeComptes = plansDeComptes.sort((pc1, pc2) => {
        const [year1, year2] = [pc1, pc2].map(
            p => Number(p.getElementsByTagName('Nomenclature')[0].getAttribute('Exer'))
        )

        return year2 - year1;
    })

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
