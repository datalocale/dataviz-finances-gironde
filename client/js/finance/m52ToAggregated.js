import {Record, OrderedSet as ImmutableSet, Map as ImmutableMap} from 'immutable'

/*
    This file's very French and even Gironde-specific.
    It describes, documents and encodes the rules that allows to get from
    an "M52 budget" to a "budget agrégé"
*/

/*
    Needs : 
    * which M52 rows are unused 
        * amount of money and % over M52 total)
*/


export function isOR(m52Row){
    return m52Row["Réel/Ordre id/Ordre diff"] === 'OR';
}

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

    'RF-1-1' : {
        label: 'Taxe Foncière sur les propriétés bâties+rôles supplémentaires',
        filter(m52Row){
            return isOR(m52Row) && isRF(m52Row) && ['A73111', 'A7318', 'A7875', 'A7788'].includes(m52Row['Article']);
        }
    },
    'RF-1-2' :{
        label: 'Cotisation sur la valeur ajoutée des entreprises (CVAE)',
        status: 'TEMPORARY',
        filter(m52Row){
            return isOR(m52Row) && isRF(m52Row) && ['A7311', 'A73112'].includes(m52Row['Article']);
        }
    },
    'RF-1-3': {
        label: 'Imposition forfaitaire pour les entreprises de réseaux (IFER)',
        filter(m52Row){
            return isOR(m52Row) && isRF(m52Row) && m52Row['Article'] === 'A73114';
        }
    },
    'RF-2-1': {
        label: 'Taxe Intérieure de Consommation sur les Produits Energétiques (TICPE)',
        filter(m52Row){
            return isOR(m52Row) && isRF(m52Row) && 'A7352' === m52Row['Article'];
        }
    },
    'RF-2-2': {
        label: 'Taxe Sur les Contrats d’Assurance (TSCA)',
        filter(m52Row){
            return isOR(m52Row) && isRF(m52Row) && m52Row['Article'] === 'A7342';
        }
    },
    'RF-3': {
        label: "Droits de mutation à titre onéreux (DMTO)",
        filter(m52Row){
            return isOR(m52Row) && isRF(m52Row) && ['A7321', 'A7322', 'A7482'].includes(m52Row['Article']);
        }
    },
    'RF-4-1': {
        label: "Taxe d'aménagement (incluant les anciennes Taxe Départementale Espaces Naturels Sensibles (TDENS) et financement CAUE)",
        status: 'TEMPORARY', // Does it work on older M52?
        filter(m52Row){
            return isOR(m52Row) && isRF(m52Row) && ['A7323', 'A7324', 'A7327'].includes(m52Row['Article']);
        }
    },
    'RF-4-2': {
        label: "Taxe sur l’électricité",
        filter(m52Row){
            return isOR(m52Row) && isRF(m52Row) && m52Row['Article'] === 'A7351';
        }
    },
    'RF-4-3': {
        label: "Redevance des mines",
        filter(m52Row){
            return isOR(m52Row) && isRF(m52Row) && m52Row['Article'] === 'A7353';
        }
    },
    'RF-4-4': {
        label: "autres fiscalités",
        status: 'TEMPORARY',
        filter(m52Row){
            return isOR(m52Row) && isRF(m52Row) && m52Row['Article'] === 'A7353';
        }
    },
    'RF-5-1': {
        label: "Dotation Globale de Fonctionnement (DGF)",
        filter(m52Row){
            return isOR(m52Row) && isRF(m52Row) && ['7411', '74122', '74123'].includes(m52Row['Article']);
        }
    },
    'RF-5-2': {
        label: "Dotation Globale de Décentralisation (DGD)",
        filter(m52Row){
            return isOR(m52Row) && isRF(m52Row) && 'A7461' === m52Row['Article'];
        }
    },
    'RF-5-3': {
        label: "Compensations fiscales",
        filter(m52Row){
            return isOR(m52Row) && isRF(m52Row) && ['A74833', 'A74834', 'A74835'].includes(m52Row['Article']);
        }
    },
    'RF-5-4': {
        label: "Dotation de compensation de la réforme de la taxe professionnelle (DCRTP)",
        filter(m52Row){
            return isOR(m52Row) && isRF(m52Row) && 'A74832' === m52Row['Article'];
        }
    },
    'RF-5-5': {
        label: "Fonds National de Garantie Individuelle de Ressources (FNGIR)",
        filter(m52Row){
            return isOR(m52Row) && isRF(m52Row) && 'A73121' === m52Row['Article'];
        }
    },
    'RF-6-1': {
        label: "Indus RSA",
        filter(m52Row){
            return isOR(m52Row) && isRF(m52Row) && ['A75342', 'A75343'].includes(m52Row['Article']);
        }
    },
    'RF-6-2': {
        label: "Contributions de la Caisse nationale de solidarité pour l'autonomie (CNSA)",
        filter(m52Row){
            return isOR(m52Row) && isRF(m52Row) && ['A747811', 'A747812'].includes(m52Row['Article']);
        }
    },
    'RF-6-3': {
        label: "Recouvrements sur bénéficiaires",
        filter(m52Row){
            return isOR(m52Row) && isRF(m52Row) && m52Row['Article'] === 'A7513';
        }
    },
    'RF-6-4': {
        label: "Autres (dont dotation conférence des financeurs)",
        filter(m52Row){
            const fonction = m52Row['Rubrique fonctionnelle'][1];
            const otherRecetteSocialeIds = Object.keys(rules)
                .filter(id => id !== 'RF-6-4' && id.startsWith('RF-6'))

            return isOR(m52Row) && isRF(m52Row) && 
                (fonction === '4' || fonction === '5') &&
                otherRecetteSocialeIds.every(
                    id => !rules[id].filter(m52Row)
                )
        }
    },
    'RF-7-1': {
        label: "Fonds de Mobilisation Départementale pour l'Insertion (FMDI)",
        filter(m52Row){
            return isOR(m52Row) && isRF(m52Row) && m52Row['Article'] === 'A74783';
        }
    },
    'RF-7-2': {
        label: "Dotation de compensation peréquée DCP",
        filter(m52Row){
            return isOR(m52Row) && isRF(m52Row) && m52Row['Article'] === 'A73125';
        }
    },
    'RF-8-1': {
        label: "Fonds de Péréquation DMTO et Fonds de solidarité",
        filter(m52Row){
            return isOR(m52Row) && isRF(m52Row) && ['A7326', 'A73261', 'A73262'].includes(m52Row['Article']); 
        }
    },    
    'RF-8-2': {
        label: "Fonds exceptionnel pour les départements en difficulté",
        filter(m52Row){
            return isOR(m52Row) && isRF(m52Row) && m52Row['Article'] === 'A74718';
        }
    },
    'RF-9-1': {
        label: "Produits des domaines (ventes)",
        filter(m52Row){
            return isOR(m52Row) && isRF(m52Row) && m52Row['Article'] === 'A752';
        }
    },
    'RF-9-2': {
        label: "Autres impôts et Taxes",
        status: 'TEMPORARY', // Manquant dans tableau
        filter(m52Row){
            return isOR(m52Row) && isRF(m52Row) && false
        }
    },

    'RF-9-3': {
        label: "Produits exceptionnels",
        filter(m52Row){
            return isOR(m52Row) && isRF(m52Row) && [
                'A7817', 'A7875', 'A7711', 'A7714', 'A7718', 
                'A773', 'A775', 'A7788'
            ].includes(m52Row['Article']);
        }
    },
    'RF-9-4': {
        label: "Dotations et participations (dont fonds européens)",
        filter(m52Row){
            return isOR(m52Row) && isRF(m52Row) && [
                'A7475', 'A7476', 'A74771', 'A74772', 'A74778', 
                'A74788', 'A74888', 'A74718', 'A7474', 'A7472', 
                'A7473'
            ].includes(m52Row['Article']);
        }
    },
    'RF-9-5': {
        label: "Restauration collège",
        filter(m52Row){
            return isOR(m52Row) && isRF(m52Row) && m52Row['Article'] === 'A74881';
        }
    },
    'RF-9-6': {
        label: "Produits des services",
        filter(m52Row){
            return isOR(m52Row) && isRF(m52Row) && m52Row['Article'].startsWith('A70');
        }
    },
    'RF-9-7': {
        label: "Remboursement charges de personnels",
        filter(m52Row){
            return isOR(m52Row) && isRF(m52Row) && ['A6419', 'A6459', 'A6479'].includes(m52Row['Article']);
        }
    },
    'RF-9-8': {
        label: "Autres produits de gestions courants",
        filter(m52Row){
            return isOR(m52Row) && isRF(m52Row) && m52Row['Article'].startsWith('A75') && m52Row['Article'] !== 'A752'; 
        }
    },
    'RF-9-9': {
        label: "Produits financiers",
        filter(m52Row){
            return isOR(m52Row) && isRF(m52Row) && m52Row['Article'].startsWith('A76'); 
        }
    },
    
    /**
     * Dépenses de fonctionnement isOR(m52Row) && 
     */

    'DF-1-1-1': {
        label: "Pour les personnes handicapées",
        filter(m52Row){
            return isOR(m52Row) && isDF(m52Row) && ['A652221', 'A65242'].includes(m52Row['Article']);
        }
    },
    'DF-1-1-2': {
        label: "Frais d’hébergement - Pour les personnes âgées",
        filter(m52Row){
            return isOR(m52Row) && isDF(m52Row) && ['A652224', 'A65243'].includes(m52Row['Article']);
        }
    },
    'DF-1-1-3': {
        label: "Liés à l’enfance",
        status: 'TEMPORARY', // "R51 + articles" ou "acticles x, y, z dans la rubrique R51" ? 
        filter(m52Row){
            const fonction = m52Row['Rubrique fonctionnelle'];
            
            return isOR(m52Row) && isDF(m52Row) && (
                fonction.slice(0, 3) === 'R51' ||
                [
                    "A652222", "A65223", "A6523", "A652411", "A652415", 
                    "A652418", "A65821", "A65111", "A6574", "A6132", 
                    "A6135", "A62268", "A6234", "A6245", "A6135", 
                    "A6184", "A62878", "A62268", "A65228", "A652412", 
                    "A6718", "A673", "A65221", "A6475"
                ].includes(m52Row['Article'])
            );
        }
    },
    'DF-1-2': {
        label: "Revenu de Solidarité Active (RSA)",
        filter(m52Row){
            return isOR(m52Row) && isDF(m52Row) && ['A6515', 'A65171', 'A65172'].includes(m52Row['Article']);
        }
    },
    'DF-1-3': {
        label: "Prestation Compensatoire du Handicap (PCH) + Allocation Compensatrice aux Tierces Personnes (ACTP)",
        filter(m52Row){
            return isOR(m52Row) && isDF(m52Row) && ['A6511211', 'A6511212', 'A651128', 'A651122'].includes(m52Row['Article']);
        }
    },
    'DF-1-4': {
        label: "Allocation Personnalisée d’Autonomie (APA)",
        filter(m52Row){
            return isOR(m52Row) && isDF(m52Row) && ['A651141', 'A651142', 'A651143', 'A651144', 'A651148'].includes(m52Row['Article']);
        }
    },
    'DF-1-5-1': {
        label: "Préventions enfants",
        status: 'TEMPORARY',
        filter(m52Row){
            return isOR(m52Row) && isDF(m52Row) && ['A652416', 'A6514', 'A65111', 'A6718'].includes(m52Row['Article']);
        }
    },
    'DF-1-5-2': {
        label: "Autres divers enfants",
        status: 'TEMPORARY', // compare w/ DF-1-1-3
        filter(m52Row){
            const fonction = m52Row['Rubrique fonctionnelle'];
            return isOR(m52Row) && isDF(m52Row) && 
                fonction.slice(0, 3) === 'R51' &&
                [
                    "A6068", "A6188", "A62268", "A6227", "A62878", 
                    "A654", "A6541", "A6542", "A6568", "A65734", 
                    "A65737", "A6574", "A6718", "A673", "A6745"
                ].includes(m52Row['Article']);
        }
    },
    'DF-1-6': {
        label: "Subventions sociales",
        status: 'TEMPORARY',
        filter(m52Row){ 
            const fonction = m52Row['Rubrique fonctionnelle'];
            return isOR(m52Row) && isDF(m52Row) && 
                (fonction[1] === '4' || fonction[1] === '5') &&
                m52Row['Article'].startsWith('A657');
        }
    },
    'DF-1-7-1': {
        label: "Transports des étudiants et des élèves handicapés",
        status: 'TEMPORARY',
        filter(m52Row){ 
            const fonction = m52Row['Rubrique fonctionnelle'];
            return isOR(m52Row) && isDF(m52Row) && 
                fonction.slice(0, 3) === 'R52' &&
                ["A6245", "A6513", "A6568", "A673"].includes(m52Row['Article']);
        }
    },
    'DF-1-7-2': {
        label: "Participation au budget de la Maison Départementale Personnes Handicapées (MDPH)",
        status: 'TEMPORARY',
        filter(m52Row){ 
            return isOR(m52Row) && isDF(m52Row) && m52Row['Article'] === 'A6588';
        }
    },
    'DF-1-7-3': {
        label: "Divers social - Autres",
        status: 'TEMPORARY', // "précédemment", c'est "DF-7" ou "DF-7-1" ?
        filter(m52Row){ 
            const fonction = m52Row['Rubrique fonctionnelle'];
            const f2 = fonction.slice(0, 2);
            const parPrestationRuleIds = Object.keys(rules).filter(id => id.startsWith('DF1') && id !== 'DF-1-7-3')

            return isOR(m52Row) && isDF(m52Row) && 
                (f2 === 'R4' || f2 === 'R5') &&
                parPrestationRuleIds.every(
                    id => !rules[id].filter(m52Row)
                )
        }
    },
    
    'DF-2-1': {
        label: "Personnes en difficultés",
        status: 'TEMPORARY', // true for all years?
        filter(m52Row){
            const fonction = m52Row['Rubrique fonctionnelle'];
            const f3 = fonction.slice(0, 3);
            return isOR(m52Row) && isDF(m52Row) && (f3 === 'R54' || f3 === 'R56');
        }
    },
    'DF-2-2': {
        label: "Personnes handicapées",
        filter(m52Row){
            const fonction = m52Row['Rubrique fonctionnelle'];
            const f3 = fonction.slice(0, 3);
            return isOR(m52Row) && isDF(m52Row) && f3 === 'R52';
        }
    },
    'DF-2-3': {
        label: "Personnes âgées",
        status: 'TEMPORARY', // true for all years?
        filter(m52Row){
            const fonction = m52Row['Rubrique fonctionnelle'];
            const f3 = fonction.slice(0, 3);
            return isOR(m52Row) && isDF(m52Row) && (f3 === 'R55' || f3 === 'R53');
        }
    },
    'DF-2-4': {
        label: "Enfance",
        filter(m52Row){
            const fonction = m52Row['Rubrique fonctionnelle'];
            const f3 = fonction.slice(0, 3);
            return isOR(m52Row) && isDF(m52Row) && f3 === 'R51';
        }
    },
    'DF-2-5': {
        label: "Autres",
        status: 'TEMPORARY', // why the change (was an "all but previous" formula before)? future-proof?
        filter(m52Row){
            const fonction = m52Row['Rubrique fonctionnelle'];
            const f3 = fonction.slice(0, 3);

            return isOR(m52Row) && isDF(m52Row) && ['R58', 'R50', 'R40', 'R41', 'R42', 'R48'].includes(f3);
        }
    },

    'DF-3-1': {
        label: "Service Départemental d'Incendie et de Secours (SDIS)",
        filter(m52Row){
            return isOR(m52Row) && isDF(m52Row) && m52Row['Article'] === 'A6553';
        }
    },
    'DF-3-2': {
        label: "Transports",
        filter(m52Row){
            const f2 = m52Row['Rubrique fonctionnelle']
                .slice(0, 2);

            return isOR(m52Row) && isDF(m52Row) && f2 === 'R8';
        }
    },
    'DF-3-3': {
        label: "Prévention spécialisée",
        filter(m52Row){
            return isOR(m52Row) && isDF(m52Row) && m52Row['Article'] === 'A6526';
        }
    },
    'DF-3-4': {
        label: "Dotation de fonctionnement des collèges",
        filter(m52Row){
            return isOR(m52Row) && isDF(m52Row) && ['A65511', 'A65512'].includes(m52Row['Article']);
        }
    },
    'DF-3-5': {
        label: "Fond social logement FSL",
        filter(m52Row){// de la fonction 72
            const f3 = m52Row['Rubrique fonctionnelle'].slice(0, 3);

            return isOR(m52Row) && isDF(m52Row) && f3 === 'R72' && ['A6556', 'A65561'].includes(m52Row['Article']);
        }
    },
    'DF-3-6': {
        label: "Subventions de fonctionnement",
        status: 'TEMPORARY',  // à retravailler (voir tableur)
        filter(m52Row){
            return isOR(m52Row) && isDF(m52Row) && false;
        }
    },
    'DF-4': { 
        label: "Frais de personnel",
        status: 'TEMPORARY', // c'est bien un "moins" ?
        filter(m52Row){
            const chap = m52Row['Chapitre'];
            const art = m52Row['Article'];
            const f3 = m52Row['Rubrique fonctionnelle'].slice(0, 3);

            return isOR(m52Row) && isDF(m52Row) &&
                (
                    chap === 'C012' ||
                    (
                        (art.startsWith('A64') || art === 'A6218' || art === 'A6336') &&
                        (chap === 'C15' || chap === 'C16' || chap === 'C17')
                    )
                ) &&
                !(f3 === 'R51' && art.startsWith('A64'))
        }
    },
    'DF-5-1': { 
        label: "Versement au fonds de peréquations",
        filter(m52Row){
            const art = m52Row['Article'];

            return isOR(m52Row) && isDF(m52Row) && (art === 'A73914' || art === 'A73926');
        }
    },
    'DF-6-1': { 
        label: "FAJ",
        status: 'TEMPORARY',
        filter(m52Row){
            return isOR(m52Row) && isDF(m52Row) && m52Row['Article'] === 'A65562';
        }
    },
    'DF-6-2': { 
        label: "Dépenses de voirie",
        filter(m52Row){
            const f4 = m52Row['Rubrique fonctionnelle'].slice(0, 4);
            const art = m52Row['Article'];

            return isOR(m52Row) && isDF(m52Row) && 
                f4 === 'R621' && 
                !(
                    art === 'A64' ||
                    art === 'A6336' ||
                    art === 'A6215' ||
                    art.startsWith('A657') 
                );
        }
    },
    'DF-6-3': { 
        label: "Questure",
        filter(m52Row){
            return isOR(m52Row) && isDF(m52Row) && ['A65861', 'A65862'].includes(m52Row['Article']);
        }
    },
    'DF-6-4': { 
        label: "Bourses départementales",
        filter(m52Row){
            return isOR(m52Row) && isDF(m52Row) && m52Row['Article'] === 'A6513';
        }
    },
    'DF-6-5': { 
        label: "Participation diverses",
        status: 'TEMPORARY',
        filter(m52Row){
            return isOR(m52Row) && isDF(m52Row) &&
            [
                "A6561", "A6556", "A65568", "A6568", "A6512", 
                "A6581", "A65821"
            ].includes(m52Row['Article']);
        }
    },
    'DF-6-6': { 
        label: "Charges exceptionnelles et provisions",
        filter(m52Row){
            const f2 = m52Row['Rubrique fonctionnelle'].slice(0, 2);
            const art = m52Row['Article'];

            return isOR(m52Row) && isDF(m52Row) && 
                (art.startsWith('A67') || art.startsWith('A68')) &&
                !(['R4', 'R5', 'R8'].includes(f2));
        }
    },
    'DF-6-7': { 
        label: "Autres",
        status: 'TEMPORARY', // 022 ?
        filter(m52Row){
            const art = m52Row['Article'];

            return isOR(m52Row) && isDF(m52Row) && 
                (art.startsWith('A022') || art.startsWith('A7398'))
        }
    },
    'DF-7-1': { 
        label: "Achats et fournitures",
        filter(m52Row){
            const f4 = m52Row['Rubrique fonctionnelle'].slice(0, 4);
            const f2 = m52Row['Rubrique fonctionnelle'].slice(0, 2);
            const art = m52Row['Article'];

            return isOR(m52Row) && isDF(m52Row) && 
                art.startsWith('A60') &&
                !(['R4', 'R5', 'R8'].includes(f2)) &&
                !(f4 === 'R621');
        }
    },
    'DF-7-2': { 
        label: "Prestations de services",
        filter(m52Row){
            const f4 = m52Row['Rubrique fonctionnelle'].slice(0, 4);
            const f2 = m52Row['Rubrique fonctionnelle'].slice(0, 2);
            const art = m52Row['Article'];

            return isOR(m52Row) && isDF(m52Row) && 
                art.startsWith('A61') &&
                !(['R4', 'R5', 'R8'].includes(f2)) &&
                !(f4 === 'R621');
        }
    },
    'DF-7-3': { 
        label: "Frais divers (frais de gestion liés à la dette …)",
        filter(m52Row){
            const f4 = m52Row['Rubrique fonctionnelle'].slice(0, 4);
            const f2 = m52Row['Rubrique fonctionnelle'].slice(0, 2);
            const art = m52Row['Article'];

            return isOR(m52Row) && isDF(m52Row) && 
                art.startsWith('A62') &&
                !(['R4', 'R5', 'R8'].includes(f2)) &&
                !(f4 === 'R621');
        }
    },
    'DF-7-4': { 
        label: "Autres impôts et taxes",
        filter(m52Row){
            const f4 = m52Row['Rubrique fonctionnelle'].slice(0, 4);
            const f2 = m52Row['Rubrique fonctionnelle'].slice(0, 2);
            const art = m52Row['Article'];

            return isOR(m52Row) && isDF(m52Row) && 
                art.startsWith('A63') &&
                !(['R4', 'R5', 'R8'].includes(f2)) &&
                !(f4 === 'R621');
        }
    },
    'DF-8-1': { 
        label: "Intérêts des emprunts",
        filter(m52Row){
            return isOR(m52Row) && isDF(m52Row) && m52Row['Article'].startsWith('A66');
        }
    },

    /**
     * Recettes d’investissement
     */

    'RI-1':{
        label: "Fonds de Compensation de la Taxe sur la Valeur Ajoutée (FCTVA)",
        filter(m52Row){
            return isOR(m52Row) && isRI(m52Row) && m52Row['Article'] === 'A10222';
        }
    },
    'RI-2':{
        label: "Dotation Décentralisée pour l’Equipement des collèges (DDEC)",
        filter(m52Row){
            return isOR(m52Row) && isRI(m52Row) && m52Row['Article'] === 'A1332';
        }
    },
    'RI-3':{
        label: "Dotation Globale d’Equipement (DGE)",
        filter(m52Row){
            return isOR(m52Row) && isRI(m52Row) && (m52Row['Article'] === 'A1341' || m52Row['Article'] === 'A10221');
        }
    },
    'RI-4': {
        label: "Subventions",
        status: 'TEMPORARY',
        filter(m52Row){
            const article = m52Row['Article'];
            return isOR(m52Row) && isRI(m52Row) && article !== 'A1332' && article !== 'A1341' &&
                (article.startsWith('A13') || article.startsWith('A204'))
        }
    },
    'RI-5': {
        label: "Produit des amendes radars autos",
        status: 'TEMPORARY',
        filter(m52Row){
            const article = m52Row['Article'];

            return isOR(m52Row) && isRI(m52Row) && (article === 'A1335' || article === 'A1345')
        }
    },
    'RI-6': {
        label: "RI - Divers",
        status: 'TEMPORARY',
        filter(m52Row){
            const article = m52Row['Article'];

            return isOR(m52Row) && isRI(m52Row) && 
                article !== 'A204' && 
                (
                    ["A165", "A1676", "A454121", "A454421", "A454428", "A45821"].includes(article) ||
                    ['C20', 'C21', 'C22', 'C23', 'C26', 'C27'].includes(m52Row['Chapitre'])
                )
        }
    },
    'RI-7': {
        label: "Cessions",
        filter(m52Row){
            return isOR(m52Row) && isRI(m52Row) && m52Row['Chapitre'] === 'C024';
        }
    },
    'RI-EM-1': {
        label: "Emprunt nouveau",
        status: 'TEMPORARY',
        filter(m52Row){
            return isOR(m52Row) && isRI(m52Row) && ["A1641", "A16311", "A167", "A168"].includes(m52Row['Article']);
        }
    },
    'RI-EM-2': {
        label: "OCLT",
        status: 'TEMPORARY',
        filter(m52Row){
            return isOR(m52Row) && isRI(m52Row) && ["A16441", "A16449"].includes(m52Row['Article']);
        }
    },

    /**
     * Dépenses d’investissement
     */


    'DI-1-1': {
        label: "Collèges",
        status: 'TEMPORARY', // pas le bon montant ?
        filter(m52Row){ // (20XXX-204+21XXX+23XXX) de la fonction 221
            const article = m52Row['Article'];
            const fonction = m52Row['Rubrique fonctionnelle'];
            const f4 = fonction.slice(0, 4);
            
            return isDI(m52Row) && article !== 'A204' &&
                (
                    article.startsWith('A20') ||
                    article.startsWith('A21') ||
                    article.startsWith('A23')
                ) &&
                f4 === 'R221'
        }
    },
    'DI-1-2': {
        label: "Routes",
        status: 'TEMPORARY', // pas le bon montant ?
        filter(m52Row){
            const article = m52Row['Article'];
            const fonction = m52Row['Rubrique fonctionnelle'];
            const f4 = fonction.slice(0, 4);
            
            return isOR(m52Row) && isDI(m52Row) && article !== 'A204' &&
                (
                    article.startsWith('A20') ||
                    article.startsWith('A21') ||
                    article.startsWith('A23')
                ) &&
                ['R621', 'R622', 'R628'].includes(f4)
        }
    },

    'DI-1-3': {
        label: "Bâtiments",
        status: 'TEMPORARY',
        filter(m52Row){
            const article = m52Row['Article'];

            return isOR(m52Row) && isDI(m52Row) && article !== 'A204' &&
                (
                    article.startsWith('A20') ||
                    article.startsWith('A21') ||
                    article.startsWith('A23')
                )
        }
    },
    'DI-1-4': {
        label: "Autres",
        status: 'TEMPORARY',
        filter(m52Row){
            const article = m52Row['Article'];
            const otherEquipementPropreRuleIds = Object.keys(rules).filter(id => id.startsWith('DI-1') && id !== 'DI-1-4');

            return isOR(m52Row) && isDI(m52Row) && article !== 'A204' &&
            ( 
                article === 'A1675' ||
                article.startsWith('A20') ||
                article.startsWith('A21') ||
                article.startsWith('A23')
            ) &&
            otherEquipementPropreRuleIds.every(
                id => !rules[id].filter(m52Row)
            );
        }
    },



    'DI-2-1': {
        label: "subventions aux communes",
        status: 'TEMPORARY',
        filter(m52Row){
            const article = m52Row['Article'];
            
            return isOR(m52Row) && isDI(m52Row) && ['A20414', 'A204141', 'A204142'].includes(article);
        }
    },
    'DI-2-2': {
        label: "sdis",
        filter(m52Row){
            const article = m52Row['Article'];
            
            return isOR(m52Row) && isDI(m52Row) && article === 'A2041781';
        }
    },
    'DI-2-3': {
        label: "subventions tiers (hors sdis)",
        status: 'TEMPORARY', // === A204 or startsWith('A204')? (Q applies to all above)
        filter(m52Row){
            const article = m52Row['Article'];
            const otherSubventionRuleIds = Object.keys(rules).filter(id => id.startsWith('DI2') && id !== 'DI2_3')

            return isOR(m52Row) && isDI(m52Row) && article.startsWith('A204') &&
                !["A20414", "A204141", "A204142", "A2041781"].includes(article);
        }
    },

    'DI-EM-1': {
        label: "Amortissement emprunt",
        status: 'TEMPORARY',
        filter(m52Row){
            const article = m52Row['Article'];

            return isOR(m52Row) && isDI(m52Row) && ["A1641", "A16311", "A167", "A168"].includes(article);
        }
    },
    'DI-EM-2': {
        label: "Amortissement OCLT",
        status: 'TEMPORARY', // + ou - ?
        filter(m52Row){
            const article = m52Row['Article'];

            return isOR(m52Row) && isDI(m52Row) && ["A16441", "A16449"].includes(article);
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