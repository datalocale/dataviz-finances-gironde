import {sum} from 'd3-array';

import {makeLigneBudgetId} from './DocBudgDataStructures';

export default function(doc, natureToChapitreFI){
    const BlocBudget = doc.getElementsByTagName('BlocBudget')[0];

    const exer = Number(BlocBudget.getElementsByTagName('Exer')[0].getAttribute('V'))

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
        
        Object.assign(ret, natureToChapitreFI(exer, ret['CodRD'], ret['Nature']))

        return ret;
    })

    for(const r of lignes){
        const id = makeLigneBudgetId(r);

        const idRows = xmlRowsById.get(id) || [];
        idRows.push(r);
        xmlRowsById.set(id, idRows);
    }

    return {
        LibelleColl: doc.getElementsByTagName('LibelleColl')[0].getAttribute('V'),
        Nomenclature: doc.getElementsByTagName('Nomenclature')[0].getAttribute('V'),
        NatDec: BlocBudget.getElementsByTagName('NatDec')[0].getAttribute('V'),
        Exer: exer,
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

}