import { Record } from 'immutable';

/*
    Keys are the one used by the Actes Budgétaire project XML files (<LigneBudget> specifically) as described in
    http://odm-budgetaire.org/doc-schema/Class_Budget_xsd_Complex_Type_TBudget.html#TBudget_LigneBudget

    'FI' has been added and refers to 'Fonctionnement/Investissement'
    'Chapitre' was added as well
*/
const LigneBudgetKeys = {
    'Nature': undefined,
    'Fonction': undefined,
    'CodRD': undefined,
    'MtReal': undefined
}


export const LigneBudgetRecord = Record(LigneBudgetKeys);

export const SplitLigneBudgetRecord = Record(Object.assign(
    {
        // this field represents the id of the aggregated set the split line belongs to
        splitFor: undefined,
        'Exer': undefined
    },
    LigneBudgetKeys
))

export const DocumentBudgetaire = Record({
    'LibelleColl': undefined,
    'Nomenclature': undefined,
    'NatDec': undefined,
    'Exer': undefined,
    'IdColl': undefined,
    'rows': undefined
});

export function makeLigneBudgetId(ligneBudget){
    return [
        ligneBudget['CodRD'],
        ligneBudget['Fonction'],
        ligneBudget['Nature']
    ].join(' ');
}