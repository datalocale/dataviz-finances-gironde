import {sum} from 'd3-array';

import {LigneBudgetRecord, DocumentBudgetaire, makeLigneBudgetId} from './DocBudgDataStructures.js';

export default function xmlDocumentToDocumentBudgetaire(doc){
    const BlocBudget = doc.getElementsByTagName('BlocBudget')[0];

    const exer = Number(BlocBudget.getElementsByTagName('Exer')[0].getAttribute('V'))

    // In the XML files, the same (CodRD, Nature, Fonction) tuple can appear
    // We consider them as a single LigneBudget
    const xmlRowsById = new Map();

    const lignes = Array.from(doc.getElementsByTagName('LigneBudget'))
    .filter(l => {
        const isOR = l.getElementsByTagName('OpBudg')[0].getAttribute('V') === '0';
        const hasNon0Amount = Number(l.getElementsByTagName('MtReal')[0].getAttribute('V')) !== 0;

        const n = l.getElementsByTagName('Nature')[0].getAttribute('V');
        const f = l.getElementsByTagName('Fonction')[0].getAttribute('V');

        return isOR && hasNon0Amount &&
            !(n === '001' && f === '01') &&
            !(n === '002' && f === '0202')
    })
    .map(l => {
        const ret = {};

        ['Nature', 'Fonction', 'CodRD', 'MtReal'].forEach(key => {
            ret[key] = l.getElementsByTagName(key)[0].getAttribute('V')
        })

        ret['MtReal'] = Number(ret['MtReal']);

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

        rows: new Set([...xmlRowsById.values()]
            .map(xmlRows => {
                const amount = sum(xmlRows.map(r => Number(r['MtReal'])))
                const r = xmlRows[0];

                return Object.assign(
                    {},
                    r, 
                    { 'MtReal': amount}
                )
            })
        )
    }

}
