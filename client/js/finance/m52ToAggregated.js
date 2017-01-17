import {Record, Set as ImmutableSet, Map as ImmutableMap} from 'immutable'

/*
    This file's very French and even Gironde-specific.
    It describes, documents and encodes the rules that allows to get from
    an "M52 budget" to a "budget agrégé"
*/

// TODO :
// export not only the rows but how to assemble them, the categories and their labels

/*
    Needs : 
    * agrégée rows money amounts
    * which M52 rows are unused (amount of money and % over M52 total)
    * which M52 rows are used several times
    * which agg rules gathered no M52 rows
    * Some agg rules depend on some other rules

    * viz
        * Next to the M52 sunburst, show the above stats about M52 usage in aggregation 
*/

export function isRF(m52Row){
    return m52Row['Dépense/Recette'] === 'R' && m52Row['Investissement/Fonctionnement'] === 'F';
}

const rules = {
    'RF1_1' : {
        label: 'Taxe Foncière sur les propriétés bâties',
        filter(m52Row){
            return isRF(m52Row) && m52Row['Article'] === 'A73111';
        }
    },
    'RF1_2' :{
        label: 'Cotisation sur la valeur ajoutée des entreprises (CVAE)',
        status: 'TEMPORARY',
        filter(m52Row){
            return isRF(m52Row) && m52Row['Article'] === 'A73112';
        }
    },
    'RF1_3': {
        label: 'Imposition forfaitaire pour les entreprises de réseaux (IFER)',
        filter(m52Row){
            return isRF(m52Row) && m52Row['Article'] === 'A73114';
        }
    },
    'RF2_1': {
        label: 'Dotation Globale de Fonctionnement (DGF)',
        filter(m52Row){
            return isRF(m52Row) && ['A7411', 'A74122', 'A74123'].includes(m52Row['Article']);
        }
    },
    'RF2_2': {
        label: 'Dotation Globale de Décentralisation (DGD)',
        filter(m52Row){
            return isRF(m52Row) && m52Row['Article'] === 'A7461';
        }
    },
    'RF2_3': {
        label: "Compensations fiscales",
        filter(m52Row){
            return isRF(m52Row) && ['A74833', 'A74834', 'A74835'].includes(m52Row['Article']);
        }
    },
    'RF2_4': {
        label: "Dotation de compensation de la réforme de la taxe professionnelle (DCRTP)",
        filter(m52Row){
            return isRF(m52Row) && ['A74832'].includes(m52Row['Article']);
        }
    },
    'RF2_5': {
        label: "Fonds National de Garantie Individuelle de Ressources (FNGIR)",
        filter(m52Row){
            return isRF(m52Row) && ['A73121'].includes(m52Row['Article']);
        }
    },
    'RF2_6': {
        label: "Fonds exceptionnel pour les départements en difficulté",
        status: 'TEMPORARY',
        filter(m52Row){
            return isRF(m52Row) && false;
        }
    },
    'RF3_1': {
        label: "Taxe Intérieure de Consommation sur les Produits Energétiques (TICPE)",
        filter(m52Row){
            return isRF(m52Row) && ['A7352'].includes(m52Row['Article']);
        }
    },
    'RF3_2': {
        label: "Taxe Sur les Contrats d’Assurance (TSCA)",
        filter(m52Row){
            return isRF(m52Row) && m52Row['Article'] === 'A7342';
        }
    },
    'RF4': {
        label: "Droits de mutation à titre onéreux (DMTO)",
        filter(m52Row){
            return isRF(m52Row) && ['A7321', 'A7322', 'A7482'].includes(m52Row['Article']);
        }
    },
    // ...
    /*
    'XX_ID_XX': {
        label: "",
        filter(m52Row){
            return false;
        }
    },
    
    
     */

    'RF5_1': {
        label: "Contributions de la Caisse nationale de solidarité pour l'autonomie (CNSA)",
        filter(m52Row){
            return isRF(m52Row) && ['A747811', 'A747812'].includes(m52Row['Article']);
        }
    },
    'RF5_2': {
        label: "Fonds de Mobilisation Départementale pour l'Insertion (FMDI)",
        filter(m52Row){
            return isRF(m52Row) && m52Row['Article'] === 'A74783';
        }
    },

    // ...

    'RF5_6': {
        label: "Recettes sociales - Autres",
        filter(m52Row){
            const fonction = m52Row['Rubrique fonctionnelle'][1];
            return isRF(m52Row) && 
                (fonction === '4' || fonction === '5') &&
                !rules['RF5_1'].filter(m52Row) &&
                !rules['RF5_2'].filter(m52Row)
        }
    },
}


const AggregatedInstructionRowRecord = Record({
    "id": undefined,
    "Libellé": undefined,
    "M52Rows": undefined,
    "Montant": undefined
})

function makeAggregatedInstructionRowRecord(id, m52Instruction){
    const rule = rules[id];

    const m52Rows = m52Instruction.filter(rule.filter);

    return AggregatedInstructionRowRecord({
        id,
        "Libellé": rule.label,
        "M52Rows": m52Rows,
        "Montant": m52Rows.reduce(((acc, curr) => {
            return acc + curr["Montant"]
        }), 0)
    })
}

export default function convert(m52Instruction){
    return ImmutableSet(
        Object.keys(rules).map(id => makeAggregatedInstructionRowRecord(id, m52Instruction))
    )
}