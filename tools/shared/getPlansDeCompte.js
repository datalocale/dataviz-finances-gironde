import {join} from 'path';
import {readFile, readdir}  from 'fs-extra';
import xmlBufferToString from 'xml-buffer-tostring';
import {DOMParser} from 'xmldom';

export default function(plansDeCompteDirectory){
    return readdir(plansDeCompteDirectory)
    .then(files => {
        return Promise.all(files.map(f => {
            return readFile(join(plansDeCompteDirectory, f))
            .then(xmlBufferToString)
            .then( str => {
                return (new DOMParser()).parseFromString(str, "text/xml");
            })
        }))
    })
    .then(plansDeCompte => {

        // sort with most recent years first
        plansDeCompte = plansDeCompte.sort((pc1, pc2) => {
            const [year1, year2] = [pc1, pc2].map(
                p => Number(p.getElementsByTagName('Nomenclature')[0].getAttribute('Exer'))
            )
    
            return year2 - year1;
        })
        return plansDeCompte;
    })
}