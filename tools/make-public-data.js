import {join} from 'path';
import {mkdir, readFile, writeFile} from 'fs-extra';
import {DOMParser} from 'xmldom';

import getPlansDeCompte from './shared/getPlansDeCompte.js'

import xmlDocumentToDocumentBudgetaire from '../src/shared/js/finance/xmlDocumentToDocumentBudgetaire';
import makeNatureToChapitreFI from '../src/shared/js/finance/makeNatureToChapitreFI';

const BUILD_FINANCE_DIR = './build/finances';
const SOURCE_FINANCE_DIR = './data/finances';


const natureToChapitreFIP = getPlansDeCompte(join(SOURCE_FINANCE_DIR, 'plansDeCompte'))
    .then(makeNatureToChapitreFI);


mkdir(BUILD_FINANCE_DIR)
.catch(err => {
    if(err.code === 'EEXIST'){
        return; // ignore
    }

    throw err;
})
.then( () => {
    return Promise.all([
        'CA2013BPAL.xml',
        'CA2014BPAL.xml',
        'CA2015BPAL.xml',
        'CA2016BPAL.xml',
        'CA2017BPAL.xml'
    ].map(f => {
        return readFile(join(SOURCE_FINANCE_DIR, 'CA', f), {encoding: 'utf-8'})
        .then( str => {
            return (new DOMParser()).parseFromString(str, "text/xml");
        })
        .then(doc => {
            return natureToChapitreFIP.then(natureToChapitreFI => {
                return xmlDocumentToDocumentBudgetaire(doc, natureToChapitreFI)
            })
        })
    }))
    .then( docBudgs => JSON.stringify(docBudgs, null, 2) )
    .then(str => writeFile(join(BUILD_FINANCE_DIR, 'doc-budgs.json'), str, 'utf-8'))

})
.catch(err => {
    console.error('err', err);
})
