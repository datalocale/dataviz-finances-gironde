import {Record, OrderedSet as ImmutableSet, Map as ImmutableMap} from 'immutable'

/*
    This file's very French and even Gironde-specific.
    It describes, documents and encodes the rules that allows to get from
    an "M52 budget" to a "budget agrégé"
*/


export function isRF(m52Row){
    return m52Row['Dépense/Recette'] === 'R' && m52Row['Investissement/Fonctionnement'] === 'F';
}
export function isDF(m52Row){
    return m52Row['Dépense/Recette'] === 'D' && m52Row['Investissement/Fonctionnement'] === 'F';
}
export function isRI(m52Row){
    return m52Row['Dépense/Recette'] === 'R' && m52Row['Investissement/Fonctionnement'] === 'I';
}
export function isDI(m52Row){
    return m52Row['Dépense/Recette'] === 'D' && m52Row['Investissement/Fonctionnement'] === 'I';
}

export const rules = Object.freeze({
    /**
     * Recettes de fonctionnement
     */

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
    'RF5_3': {
        label: "Recouvrements sur bénéficiaires",
        filter(m52Row){
            return isRF(m52Row) && m52Row['Article'] === 'A7513';
        }
    },
    'RF5_4': {
        label: "Indus RSA",
        filter(m52Row){
            return isRF(m52Row) && ['A75342', 'A75343'].includes(m52Row['Article']);
        }
    },
    'RF5_5': {
        label: "Dotation de compensation peréquée DCP",
        filter(m52Row){
            return isRF(m52Row) && m52Row['Article'] === 'A73125';
        }
    },

    'RF5_6': {
        label: "Recettes sociales - Autres",
        filter(m52Row){
            const fonction = m52Row['Rubrique fonctionnelle'][1];
            return isRF(m52Row) && 
                (fonction === '4' || fonction === '5') &&
                ['RF5_1', 'RF5_2', 'RF5_3', 'RF5_4', 'RF5_5'].every(
                    id => !rules[id].filter(m52Row)
                )
        }
    },
    'RF6_1': {
        label: "Taxe Départementale Espaces Naturels Sensibles (TDENS)",
        status: 'TEMPORARY', // TODO demander confirmation pour les années
        filter(m52Row){
            return isRF(m52Row) && m52Row['Exercice'] < 2015 && m52Row['Article'] === 'A7323';
        }
    },
    'RF6_2': {
        label: "Taxe pour le financement",
        status: 'TEMPORARY', // TODO demander confirmation pour les années
        filter(m52Row){
            return isRF(m52Row) && m52Row['Exercice'] < 2015 && m52Row['Article'] === 'A7324';
        }
    },
    'RF6_3': {
        label: "Taxe pour le financement",
        status: 'TEMPORARY', // TODO demander confirmation pour les années
        filter(m52Row){
            return isRF(m52Row) && m52Row['Exercice'] >= 2015 && m52Row['Article'] === 'A7327';
        }
    },
    'RF6_4': {
        label: "Taxe sur l’électricité",
        filter(m52Row){
            return isRF(m52Row) && m52Row['Article'] === 'A7351';
        }
    },
    'RF6_5': {
        label: "Redevance des mines",
        filter(m52Row){
            return isRF(m52Row) && m52Row['Article'] === 'A7353';
        }
    },
    'RF7_1': {
        label: "Produits des domaines (ventes)",
        filter(m52Row){
            return isRF(m52Row) && m52Row['Article'] === 'A752';
        }
    },
    'RF7_2': {
        label: "Autres impôts et Taxes",
        status: 'TEMPORARY',
        filter(m52Row){
            return false;
        }
    },
    'RF7_3': {
        label: "Produits exceptionnels",
        filter(m52Row){
            return isRF(m52Row) && [
                'A7817', 'A7875', 'A7711', 'A7714', 'A7718', 
                'A773', 'A775', 'A7788'
            ].includes(m52Row['Article']);
        }
    },
    'RF7_4': {
        label: "Dotations et participations (dont fonds européens)",
        filter(m52Row){
            return isRF(m52Row) && [
                'A7475', 'A7476', 'A74771', 'A74772', 'A74778', 
                'A74788', 'A74888', 'A74718', 'A7474', 'A7472', 
                'A7473'
            ].includes(m52Row['Article']);
        }
    },
    'RF7_5': {
        label: "Restauration collège",
        filter(m52Row){
            return isRF(m52Row) && m52Row['Article'] === 'A74881';
        }
    },
    'RF7_6': {
        label: "Produits des services",
        filter(m52Row){
            return isRF(m52Row) && m52Row['Article'].startsWith('A70');
        }
    },
    'RF7_7': {
        label: "Remboursement charges de personnels",
        filter(m52Row){
            return isRF(m52Row) && ['A6419', 'A6459', 'A6479'].includes(m52Row['Article']);
        }
    },
    'RF7_8': {
        label: "Autres prduits de gestions courants",
        filter(m52Row){
            return isRF(m52Row) && m52Row['Article'].startsWith('A75') && m52Row['Article'] !== 'A752'; 
        }
    },
    'RF7_9': {
        label: "Produits financiers",
        filter(m52Row){
            return isRF(m52Row) && m52Row['Article'].startsWith('A76'); 
        }
    },
    'RF8_1': {
        label: "Fonds de Péréquation DMTO et Fonds de solidarité",
        status: 'TEMPORARY',
        filter(m52Row){
            return isRF(m52Row) && m52Row['Article'] === 'A7326'; 
        }
    },
    
    /**
     * Dépenses de fonctionnement
     */

    'DF1_1_1': {
        label: "Frais d’hébergement - Pour les personnes handicapées",
        filter(m52Row){
            return isDF(m52Row) && ['A652221', 'A65242'].includes(m52Row['Article']);
        }
    },
    'DF1_1_2': {
        label: "Frais d’hébergement - Pour les personnes âgées",
        filter(m52Row){
            return isDF(m52Row) && ['A652224', 'A65243'].includes(m52Row['Article']);
        }
    },
    'DF1_1_3': {
        label: "Liés à l’enfance",
        filter(m52Row){
            return isDF(m52Row) && ['A652411', 'A652412', 'A652415', 'A652418'].includes(m52Row['Article']);
        }
    },
    'DF1_2': {
        label: "Revenu de Solidarité Active (RSA)",
        filter(m52Row){
            return isDF(m52Row) && ['A6515', 'A65171', 'A65172'].includes(m52Row['Article']);
        }
    },
    'DF1_3': {
        label: "Prestation Compensatoire du Handicap (PCH) + Allocation Compensatrice aux Tierces Personnes (ACTP)",
        filter(m52Row){
            return isDF(m52Row) && ['A6511211', 'A6511212', 'A651128', 'A651122'].includes(m52Row['Article']);
        }
    },
    'DF1_4': {
        label: "Allocation Personnalisée d’Autonomie (APA)",
        filter(m52Row){
            return isDF(m52Row) && ['A651141', 'A651142', 'A651143', 'A651144', 'A651148'].includes(m52Row['Article']);
        }
    },
    'DF1_5_1': {
        label: "Autres prestations - AEMO (Aides Educatives Milieu Ouvert)",
        filter(m52Row){
            return isDF(m52Row) && ['A652416'].includes(m52Row['Article']);
        }
    },
    'DF1_5_2': {
        label: "Divers enfants - Autres",
        status: 'TEMPORARY',
        filter(m52Row){
            const fonction = m52Row['Rubrique fonctionnelle'];
            return isDF(m52Row) && 
                fonction.slice(1, 3) === '51' &&
                !(['A652416', 'A652411', 'A652412', 'A652415', 'A652418'].includes(m52Row['Article']));
        }
    },
    'DF1_6': {
        label: "Subventions sociales",
        status: 'TEMPORARY',
        filter(m52Row){ 
            const fonction = m52Row['Rubrique fonctionnelle'];
            return isDF(m52Row) && 
                (fonction[1] === '4' || fonction[1] === '5') &&
                m52Row['Article'].startsWith('A657');
        }
    },
    'DF1_7_1': {
        label: "Transports des étudiants et des élèves handicapés",
        status: 'TEMPORARY',
        filter(m52Row){ 
            const fonction = m52Row['Rubrique fonctionnelle'];
            return isDF(m52Row) && 
                fonction.slice(1, 3) === '52' &&
                m52Row['Article'].startsWith('A624');
        }
    },
    'DF1_7_2': {
        label: "Participation au budget de la Maison Départementale Personnes Handicapées (MDPH)",
        status: 'TEMPORARY',
        filter(m52Row){ 
            return isDF(m52Row) && m52Row['Article'] === 'A6588';
        }
    },
    'DF1_7_3': {
        label: "Divers social - Autres",
        status: 'TEMPORARY',
        filter(m52Row){ 
            const fonction = m52Row['Rubrique fonctionnelle'];
            const parPrestationRuleIds = Object.keys(rules).filter(id => id.startsWith('DF1') && id !== 'DF1_7_3')

            return isDF(m52Row) && 
                (fonction[1] === '4' || fonction[1] === '5') &&
                parPrestationRuleIds.every(
                    id => !rules[id].filter(m52Row)
                )

        }
    },
    
    'DF2_1': {
        label: "Personnes en difficultés",
        filter(m52Row){
            const fonction = m52Row['Rubrique fonctionnelle'];
            return isDF(m52Row) && fonction.slice(1, 3) === '54' && fonction.slice(1, 3) === '55';
        }
    },
    'DF2_2': {
        label: "Personnes handicapées",
        filter(m52Row){
            const fonction = m52Row['Rubrique fonctionnelle'];
            return isDF(m52Row) && fonction.slice(1, 3) === '52';
        }
    },
    'DF2_3': {
        label: "Personnes âgées",
        filter(m52Row){
            const fonction = m52Row['Rubrique fonctionnelle'];
            return isDF(m52Row) && fonction.slice(1, 3) === '56';
        }
    },
    'DF2_4': {
        label: "Enfance",
        filter(m52Row){
            const fonction = m52Row['Rubrique fonctionnelle'];
            return isDF(m52Row) && fonction.slice(1, 3) === '51';
        }
    },
    'DF2_5': {
        label: "Actions sociales par publics - Autres",
        filter(m52Row){
            const fonction = m52Row['Rubrique fonctionnelle'];
            const parPublicRuleIds = Object.keys(rules).filter(id => id.startsWith('DF2') && id !== 'DF2_5')

            return isDF(m52Row) && 
                (fonction[1] === '4' || fonction[1] === '5') &&
                parPublicRuleIds.every(
                    id => !rules[id].filter(m52Row)
                )
        }
    },
    'DF3_1': {
        label: "Service Départemental d'Incendie et de Secours (SDIS)",
        filter(m52Row){
            return isDF(m52Row) && m52Row['Article'] === 'A6553';
        }
    },
    'DF3_2': {
        label: "Transports",
        filter(m52Row){
            const fonction = m52Row['Rubrique fonctionnelle'];

            return isDF(m52Row) && fonction[1] === '8';
        }
    },
    'DF3_3': {
        label: "Prévention spécialisée",
        filter(m52Row){
            return isDF(m52Row) && m52Row['Article'] === 'A6526';
        }
    },
    'DF3_4': {
        label: "Dotation de fonctionnement des collèges",
        filter(m52Row){
            return isDF(m52Row) && ['A65511', 'A65512'].includes(m52Row['Article']);
        }
    },
    'DF3_5': {
        label: "Fond social logement FSL",
        status: 'TEMPORARY',
        filter(m52Row){
            return isDF(m52Row) && false;
        }
    },
    'DF3_6': {
        label: "Subventions de fonctionnement",
        status: 'TEMPORARY',
        filter(m52Row){
            return isDF(m52Row) && false;
        }
    },
    'DF4': { 
        label: "Frais de personnel",
        filter(m52Row){
            const chap = m52Row['Chapitre'];
            const art = m52Row['Article'];

            return isDF(m52Row) && (
                chap === 'C012' ||
                (
                    (art.startsWith('A64') || art === 'A6218' || art === 'A6336') &&
                    (chap === 'C15' || chap === 'C16' || chap === 'C17')
                )
            );
        }
    },
    'DF5': { 
        label: "Versement au fonds de peréquations",
        filter(m52Row){
            const art = m52Row['Article'];

            return isDF(m52Row) && 
                (art === 'A73914' || art === 'A73926');
        }
    },
    'DF6_1': { 
        label: "Dépenses de voirie",
        status: 'TEMPORARY',
        filter(m52Row){
            return isDF(m52Row) && false;
        }
    },
    'DF6_2': { 
        label: "Questure",
        status: 'TEMPORARY',
        filter(m52Row){
            return isDF(m52Row) && false;
        }
    },
    'DF6_3': { 
        label: "Dépenses liés aux ports",
        status: 'TEMPORARY',
        filter(m52Row){
            return isDF(m52Row) && false;
        }
    },
    'DF6_4': { 
        label: "Bourses départementales",
        status: 'TEMPORARY',
        filter(m52Row){
            return isDF(m52Row) && m52Row['Article'] === 'A6513';
        }
    },
    'DF6_5': { 
        label: "Participation diverses",
        status: 'TEMPORARY',
        filter(m52Row){
            return isDF(m52Row) && false;
        }
    },
    'DF7_1': { 
        label: "Achats et fournitures",
        filter(m52Row){
            const fonction = m52Row['Rubrique fonctionnelle'];
            const art = m52Row['Article'];

            return isDF(m52Row) && 
                art.startsWith('A60') &&
                !(['4', '5', '8'].includes(fonction[1]));
        }
    },
    'DF7_2': { 
        label: "Prestations de services",
        filter(m52Row){
            const fonction = m52Row['Rubrique fonctionnelle'];
            const art = m52Row['Article'];

            return isDF(m52Row) && 
                art.startsWith('A61') &&
                !(['4', '5', '8'].includes(fonction[1]));
        }
    },
    'DF7_3': { 
        label: "Frais divers (frais de gestion liés à la dette …)",
        filter(m52Row){
            const fonction = m52Row['Rubrique fonctionnelle'];
            const art = m52Row['Article'];

            return isDF(m52Row) && 
                art.startsWith('A62') &&
                !(['4', '5', '8'].includes(fonction[1]));
        }
    },
    'DF7_4': { 
        label: "Autres impôts et taxes",
        filter(m52Row){
            const fonction = m52Row['Rubrique fonctionnelle'];
            const art = m52Row['Article'];

            return isDF(m52Row) && 
                art.startsWith('A63') &&
                !(['4', '5', '8'].includes(fonction[1]));
        }
    },
    'DF7_5': { 
        label: "Charges exceptionnelles et provisions",
        filter(m52Row){
            const fonction = m52Row['Rubrique fonctionnelle'];
            const art = m52Row['Article'];

            return isDF(m52Row) && 
                (art.startsWith('A67') || art.startsWith('A68')) &&
                !(['4', '5', '8'].includes(fonction[1]));
        }
    },
    'DF7_6': { 
        label: "Frais généraux - Autres",
        status: 'TEMPORARY',
        filter(m52Row){
            return isDF(m52Row) && false;
        }
    },
    'DF8_1': { 
        label: "Intérêts des emprunts",
        status: 'TEMPORARY',
        filter(m52Row){
            return isDF(m52Row) && m52Row['Article'].startsWith('A66');
        }
    },

    /**
     * Recettes d’investissement
     */

    'RI1':{
        label: "Fonds de Compensation de la Taxe sur la Valeur Ajoutée (FCTVA)",
        filter(m52Row){
            return isRI(m52Row) && m52Row['Article'] === 'A10222';
        }
    },
    'RI2':{
        label: "Dotation Décentralisée pour l’Equipement des collèges (DDEC)",
        filter(m52Row){
            return isRI(m52Row) && m52Row['Article'] === 'A1332';
        }
    },
    'RI3':{
        label: "Dotation Globale d’Equipement (DGE)",
        filter(m52Row){
            return isRI(m52Row) && (m52Row['Article'] === 'A1341' || m52Row['Article'] === 'A10221');
        }
    },
    'RI4': {
        label: "Subventions",
        status: 'TEMPORARY',
        filter(m52Row){
            const article = m52Row['Article'];
            return isRI(m52Row) && article !== 'A1332' && article !== 'A1341' &&
                (article.startsWith('A13') || article.startsWith('A204'))
        }
    },
    'RI5': {
        label: "RI - Divers",
        status: 'TEMPORARY',
        filter(m52Row){
            const article = m52Row['Article'];

            return isRI(m52Row) && article !== 'A10221' && article !== 'A10222' &&
                article.startsWith('A10') && 
                ['C20', 'C21', 'C22', 'C23', 'C26', 'C27'].includes(m52Row['Chapitre']);
        }
    },
    'RI6': {
        label: "Cessions",
        status: 'TEMPORARY',
        filter(m52Row){
            return isRI(m52Row) && m52Row['Chapitre'] === 'C024';
        }
    },

    /**
     * Dépenses d’investissement
     */

    'DI1_1': {
        label: "Bâtiments",
        status: 'TEMPORARY',
        filter(m52Row){
            const article = m52Row['Article'];
            //20XXX-204+21XXX+23XXX

            return isDI(m52Row) && article !== 'A204' &&
                (
                    article.startsWith('A20') ||
                    article.startsWith('A21') ||
                    article.startsWith('A23')
                )
        }
    },
    'DI1_2': {
        label: "Routes",
        filter(m52Row){
            const article = m52Row['Article'];
            const fonction = m52Row['Rubrique fonctionnelle'];
            const _3f = fonction.slice(1, 4);
            

            return isDI(m52Row) && article !== 'A204' &&
                (
                    article.startsWith('A20') ||
                    article.startsWith('A21') ||
                    article.startsWith('A23')
                ) &&
                ['621', '622', '628'].includes(_3f)
        }
    },
    'DI1_3': {
        label: "Collèges",
        filter(m52Row){
            const article = m52Row['Article'];
            const fonction = m52Row['Rubrique fonctionnelle'];
            const _3f = fonction.slice(1, 4);
            
            return isDI(m52Row) && article !== 'A204' &&
                (
                    article.startsWith('A20') ||
                    article.startsWith('A21') ||
                    article.startsWith('A23')
                ) &&
                _3f === '221'
        }
    },
    'DI1_4': {
        label: "Equipements Propres - Autres",
        status: 'TEMPORARY',
        filter(m52Row){
            const article = m52Row['Article'];
            
            return isDI(m52Row) && article === 'A1675';
        }
    },
    'DI2_1': {
        label: "subventions aux communes",
        status: 'TEMPORARY',
        filter(m52Row){
            const article = m52Row['Article'];
            
            return isDI(m52Row) && ['A20414', 'A204141', 'A204142'].includes(article);
        }
    },
    'DI2_2': {
        label: "sdis",
        filter(m52Row){
            const article = m52Row['Article'];
            
            return isDI(m52Row) && article === 'A2041781';
        }
    },
    'DI2_3': {
        label: "subventions tiers (hors sdis)",
        filter(m52Row){
            const article = m52Row['Article'];
            const otherSubventionRuleIds = Object.keys(rules).filter(id => id.startsWith('DI2') && id !== 'DI2_3')

            return isDI(m52Row) && article.startsWith('A204') &&
                otherSubventionRuleIds.every(
                    id => !rules[id].filter(m52Row)
                );
        }
    },

    /**
     * Emprunt
     */

    'EM1': {
        label: "Emprunt nouveau : Capital mobilisé dans l’année hors OCLT et réaménagemens de dettes",
        status: 'TEMPORARY',
        filter(m52Row){
            const article = m52Row['Article'];

            return m52Row['Dépense/Recette'] === 'R' && article.startsWith('A16');
        }
    },
    'EM2': {
        label: "Emprunt remboursé : Capital remboursé dans l’année hors OCLT et réaménagemens de dettes",
        status: 'TEMPORARY',
        filter(m52Row){
            const article = m52Row['Article'];

            return m52Row['Dépense/Recette'] === 'D' && article.startsWith('A16') && article !== 'A1675';
        }
    }
});


const AggregatedInstructionRowRecord = Record({
    "id": undefined,
    "Libellé": undefined,
    "Statut": undefined,
    "M52Rows": undefined,
    "Montant": undefined
})

function makeAggregatedInstructionRowRecord(id, m52Instruction){
    const rule = rules[id];

    const m52Rows = m52Instruction.filter(rule.filter);

    return AggregatedInstructionRowRecord({
        id,
        "Libellé": rule.label,
        "Statut": rule.status,
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