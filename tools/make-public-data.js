import {join} from 'path';
import * as fs from 'fs-extra';
import {DOMParser} from 'xmldom';

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

        return section
    }
})



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

            return natureToSectionP.then(natureToSection => {
                // TODO merge amounts of same RD/nat/fonc rows
                return {
                    rows: Array.from(doc.getElementsByTagName('LigneBudget'))
                        .filter(l => 
                            l.getElementsByTagName('OpBudg')[0].getAttribute('V') === '0' && 
                            Number(l.getElementsByTagName('MtReal')[0].getAttribute('V')) > 0
                        )
                        .map(l => {
                            const ret = {};

                            ['Nature', 'Fonction', 'CodRD', 'MtReal'].forEach(key => {
                                ret[key] = l.getElementsByTagName(key)[0].getAttribute('V')
                            })

                            ret['MtReal'] = Number(ret['MtReal']);
                            ret['FI'] = natureToSection(ret['Nature'], ret['CodRD'])

                            return ret;
                        })
                }

            })

        })
        .then( docBudg => JSON.stringify(docBudg, null, 3) )
        .then(str => writeFile(join(BUILD_FINANCE_DIR, f.replace('.xml', '.json')), str, 'utf-8'))
    }))

})
.catch(err => {
    console.error('err', err);
})




