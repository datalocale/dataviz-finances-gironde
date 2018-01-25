import {join} from 'path';
import * as fs from 'fs-extra';
import {DOMParser} from 'xmldom';
import {sum} from 'd3-array';

const {mkdir, readFile, writeFile} = fs;

const BUILD_FINANCE_DIR = './build/finances';
const SOURCE_FINANCE_DIR = './data/finances';

const natureToSectionP = readFile(join(SOURCE_FINANCE_DIR, 'planDeCompte-2017.xml'), {encoding: 'utf-8'})
.then( str => {
    return (new DOMParser()).parseFromString(str, "text/xml");
})
.then(doc => {
    const comptes = Array.from(doc.getElementsByTagName('Compte'))
    const chapitres = Array.from(doc.getElementsByTagName('Chapitre'))

    return {
        comptes: comptes.map(e => {
            const ret = {};
            
            ['Code', 'Libelle', 'Lib_court', 'DEquip', 'DR', 'DOES', 'DOIS', 'REquip', 'RR', 'ROES', 'ROIS'].forEach(key => {
                ret[key] = e.getAttribute(key);
            })

            return ret
        }),
        chapitres: chapitres.map(e => {
            const ret = {};
            
            ['Code', 'Libelle', 'Lib_court', 'TypeChapitre', 'Section', 'Special'].forEach(key => {
                ret[key] = e.getAttribute(key);
            })

            return ret
        })
    }
})
.then(plan => {
    const chapitreCodeByNatureR = new Map()
    const chapitreCodeByNatureD = new Map()
    plan.comptes.forEach(c => {
        chapitreCodeByNatureR.set(c['Code'], c['RR'])
        chapitreCodeByNatureD.set(c['Code'], c['DR'])
    })
    
    const sectionByChapitreCode = new Map()
    plan.chapitres.forEach(c => sectionByChapitreCode.set(c['Code'], c['Section']))

    return function(nature, RD){
        const chapitreCodeByNature = RD === 'R' ? chapitreCodeByNatureR : chapitreCodeByNatureD;
        const chapitreCode = chapitreCodeByNature.get(nature);

        if(!chapitreCode)
            console.warn('No chapitreCode for', RD, nature);

        const section = sectionByChapitreCode.get(chapitreCode)

        if(!section)
            console.warn('No section for', RD, nature, chapitreCode);

        return {
            section,
            Chapitre: chapitreCode
        }
    }
})


function rowId({RD, fonction, nature}){
    return `${RD}-${fonction}-${nature}`;
}


mkdir(BUILD_FINANCE_DIR)
.catch(err => {
    if(err.code === 'EEXIST'){
        return; // ignore
    }

    throw err;
})
.then( () => {
    return Promise.all([
        'CA2012BPAL.xml',
        'CA2013BPAL.xml',
        'CA2014BPAL.xml',
        'CA2015BPAL.xml',
        'CA2016BPAL.xml'
    ].map(f => {
        return readFile(join(SOURCE_FINANCE_DIR, f), {encoding: 'utf-8'})
        .then( str => {
            return (new DOMParser()).parseFromString(str, "text/xml");
        })
        .then(doc => {
            const BlocBudget = doc.getElementsByTagName('BlocBudget')[0];

            return natureToSectionP.then(natureToChapitreSection => {
                const xmlRowsById = new Map();

                const lignes = Array.from(doc.getElementsByTagName('LigneBudget'))
                .filter(l => 
                    // Garder seulement les ordres réels
                    l.getElementsByTagName('OpBudg')[0].getAttribute('V') === '0' && 
                    // ... et les lignes dont le montant n'est pas nul
                    Number(l.getElementsByTagName('MtReal')[0].getAttribute('V')) !== 0
                )
                .map(l => {
                    const ret = {};

                    ['Nature', 'Fonction', 'CodRD', 'MtReal'].forEach(key => {
                        ret[key] = l.getElementsByTagName(key)[0].getAttribute('V')
                    })

                    ret['MtReal'] = Number(ret['MtReal']);
                    
                    const {section, Chapitre} = natureToChapitreSection(ret['Nature'], ret['CodRD'])
                    ret['FI'] = section
                    ret['Chapitre'] = Chapitre

                    return ret;
                })

                for(const r of lignes){
                    const id = rowId({
                        RD: r['CodRD'],
                        fonction: r['Fonction'],
                        nature: r['Nature']
                    });
            
                    const idRows = xmlRowsById.get(id) || [];
                    idRows.push(r);
                    xmlRowsById.set(id, idRows);
                }

                return {
                    LibelleColl: doc.getElementsByTagName('LibelleColl')[0].getAttribute('V'),
                    Nomenclature: doc.getElementsByTagName('Nomenclature')[0].getAttribute('V'),
                    NatDec: BlocBudget.getElementsByTagName('NatDec')[0].getAttribute('V'),
                    Exer: Number(BlocBudget.getElementsByTagName('Exer')[0].getAttribute('V')),
                    IdColl: doc.getElementsByTagName('IdColl')[0].getAttribute('V'),

                    rows: Array.from(xmlRowsById.values())
                    .map(xmlRows => {
                        const amount = sum(xmlRows.map(r => Number(r['MtReal'])))
                        const r = xmlRows[0];
    
                        return Object.assign(
                            {},
                            r,
                            {'MtReal': amount}
                        )
                    })
                }

            })

        })
    }))
    .then( docBudgs => JSON.stringify(docBudgs, null, 2) )
    .then(str => writeFile(join(BUILD_FINANCE_DIR, 'doc-budgs.json'), str, 'utf-8'))

})
.catch(err => {
    console.error('err', err);
})




