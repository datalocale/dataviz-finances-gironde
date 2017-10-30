import {Record} from 'immutable';

/*
    Keys are the one used by the Gironde Département "CEDI export"
    https://datacat.datalocale.fr/file/1242019/raw/cedi_2015_CA.csv

*/
const m52RecordKeys = {
    //'Département': undefined,
    //'Budget': undefined,
    //'Type nomenclature': undefined,
    'Exercice': undefined,
    'Type fichier': undefined,
    'Date vote': undefined,
    'Dépense/Recette': undefined,
    'Investissement/Fonctionnement': undefined,
    'Réel/Ordre id/Ordre diff': undefined,
    'Chapitre': undefined,
    'Sous-chapitre': undefined,
    'Opération': undefined,
    'Article': undefined,
    'Rubrique fonctionnelle': undefined,
    'Libellé': undefined,
    'Code devise': undefined,
    'Montant': undefined
}


export const M52RowRecord = Record(m52RecordKeys);

export const SplitM52RowRecord = Record(Object.assign(
    {
        // this field represents the id of the aggregated set the split line belongs to
        splitFor: undefined
    },
    m52RecordKeys
))

export const M52Instruction = Record({
    'département': undefined,
    'year': undefined,
    'type': undefined,
    'rows': undefined
});

export function makeM52RowId(m52Row){
    return [
        m52Row['Dépense/Recette'] + m52Row['Investissement/Fonctionnement'],
        m52Row["Chapitre"],
        m52Row["Rubrique fonctionnelle"],
        m52Row["Article"]
    ].join(' ');
}