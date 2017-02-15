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
    'RF-1-4': {
        label: 'Reversement CVAE Région',
        filter(m52Row){
            return isOR(m52Row) && isRF(m52Row) && m52Row['Article'] === 'A731';
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
        status: 'AMOUNT_ISSUE',
        filter(m52Row){
            return isOR(m52Row) && isRF(m52Row) && ['A7362', 'A7353', 'A7388'].includes(m52Row['Article']);
        }
    },
    'RF-5-1': {
        label: "Dotation Globale de Fonctionnement (DGF)",
        filter(m52Row){
            return isOR(m52Row) && isRF(m52Row) && ['A7411', 'A74122', 'A74123'].includes(m52Row['Article']);
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
        status: 'AMOUNT_ISSUE',
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
        label: "Produits exceptionnels",
        status: 'AMOUNT_ISSUE',
        filter(m52Row){
            return isOR(m52Row) && isRF(m52Row) && [
                'A7817', 'A7875', 'A7711', 'A7714', 'A7718', 
                'A773', 'A7788'
            ].includes(m52Row['Article']);
        }
    },
    'RF-9-3': {
        label: "Dotations et participations (dont fonds européens)",
        filter(m52Row){
            return isOR(m52Row) && isRF(m52Row) && [
                'A7475', 'A7476', 'A74771', 'A74772', 'A74778', 
                'A74788', 'A74888', 'A74718', 'A7474', 'A7472', 
                'A7473'
            ].includes(m52Row['Article']);
        }
    },
    'RF-9-4': {
        label: "Restauration collège",
        filter(m52Row){
            return isOR(m52Row) && isRF(m52Row) && m52Row['Article'] === 'A74881';
        }
    },
    'RF-9-5': {
        label: "Produits des services",
        filter(m52Row){
            return isOR(m52Row) && isRF(m52Row) && m52Row['Article'].startsWith('A70');
        }
    },
    'RF-9-6': {
        label: "Remboursement charges de personnels",
        filter(m52Row){
            return isOR(m52Row) && isRF(m52Row) && ['A6419', 'A6459', 'A6479'].includes(m52Row['Article']);
        }
    },
    'RF-9-7': {
        label: "Autres produits de gestions courants",
        status: 'AMOUNT_ISSUE',
        filter(m52Row){
            return isOR(m52Row) && isRF(m52Row) && m52Row['Article'].startsWith('A75') && m52Row['Article'] !== 'A752'; 
        }
    },
    'RF-9-8': {
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
        status: 'TEMPORARY', // en attente de validation formule finale
        filter(m52Row){
            const fonction = m52Row['Rubrique fonctionnelle'];
            
            return isOR(m52Row) && isDF(m52Row) && 
                fonction.slice(0, 3) === 'R51' &&
                (
                    [
                        "A6132", "A6135", "A6184",
                        "A62268", "A6234", "A6245", "A62878",
                        "A65111", "A65221", "A652222", "A65223", "A65228", 
                        "A6523", "A652411", "A652412", "A652415", "A652418", 
                        "A6574", "A65821", 
                        "A6718", "A673"
                    ].includes(m52Row['Article']) ||
                    m52Row['Article'].startsWith('A64')
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
        status: 'AMOUNT_ISSUE',
        filter(m52Row){
            const fonction = m52Row['Rubrique fonctionnelle'];

            return isOR(m52Row) && isDF(m52Row) && 
                fonction.slice(0, 3) === 'R51' &&
                ['A652416', 'A6514', 'A65111', 'A6718'].includes(m52Row['Article']);    
        }
    },
    'DF-1-5-2': {
        label: "Autres divers enfants",
        status: 'AMOUNT_ISSUE',
        filter(m52Row){
            const fonction = m52Row['Rubrique fonctionnelle'];

            return isOR(m52Row) && isDF(m52Row) && 
                fonction.slice(0, 3) === 'R51' &&
                [
                    "A6068", "A6188", "A616", "A62268", "A6227", 
                    "A62878", "A654", "A6541", "A6542", "A6568", 
                    "A65734", "A65737", "A6574", "A6718", "A673", 
                    "A6745"
                ].includes(m52Row['Article']);
        }
    },
    'DF-1-6': {
        label: "Subventions sociales",
        status: 'TEMPORARY', // en attente de validation formule
        filter(m52Row){ 
            const fonction = m52Row['Rubrique fonctionnelle'];
            const art = m52Row['Article'];
            const f2 = fonction.slice(0, 2);
            return isOR(m52Row) && isDF(m52Row) && 
                (f2 === 'R4' || f2 === 'R5') &&
                art.startsWith('A657') &&
                fonction !== 'R51';
        }
    },
    'DF-1-7': {
        label: "Divers social - Autres",
        status: 'TEMPORARY',
        filter(m52Row){ 
            const fonction = m52Row['Rubrique fonctionnelle'];
            const art = m52Row['Article'];
            const f2 = fonction.slice(0, 2);
            const parPrestationRuleIds = Object.keys(rules).filter(id => id.startsWith('DF-1-') && id !== 'DF-1-7');

            return isOR(m52Row) && isDF(m52Row) && 
                (f2 === 'R4' || f2 === 'R5') &&
                (
                    art.startsWith('A60') || art.startsWith('A61') || art.startsWith('A62') || 
                    art.startsWith('A63') || art.startsWith('A65') || art.startsWith('A67') 
                ) &&
                parPrestationRuleIds.every(
                    id => !rules[id].filter(m52Row)
                );
        }
    },
    
    'DF-2-1': {
        label: "Personnes en difficultés",
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
        filter(m52Row){
            const fonction = m52Row['Rubrique fonctionnelle'];
            const f3 = fonction.slice(0, 3);

            return isOR(m52Row) && isDF(m52Row) && 
                ['R58', 'R50', 'R40', 'R41', 'R42', 'R48'].includes(f3)
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
        status: 'AMOUNT_ISSUE',
        filter(m52Row){
            const f2 = m52Row['Rubrique fonctionnelle']
                .slice(0, 2);

            return isOR(m52Row) && isDF(m52Row) && f2 === 'R8';
        }
    },
    'DF-3-3': {
        label: "Transports des étudiants et des élèves handicapés",
        filter(m52Row){
            const fonction = m52Row['Rubrique fonctionnelle'];
            const f3 = fonction.slice(0, 3);

            return isOR(m52Row) && isDF(m52Row) && 
                f3 === 'R52' &&
                ['A6245', 'A6513', 'A6568', 'A673'].includes(m52Row['Article']);
        }
    },



    'DF-3-4': {
        label: "Prévention spécialisée",
        filter(m52Row){
            return isOR(m52Row) && isDF(m52Row) && ['A6526', 'A6563'].includes(m52Row['Article']);
        }
    },
    'DF-3-5': {
        label: "Dotation de fonctionnement des collèges",
        filter(m52Row){
            return isOR(m52Row) && isDF(m52Row) && ['A65511', 'A65512'].includes(m52Row['Article']);
        }
    },
    'DF-3-6': {
        label: "Fond social logement FSL",
        status: 'AMOUNT_ISSUE',
        filter(m52Row){
            const f3 = m52Row['Rubrique fonctionnelle'].slice(0, 3);

            return isOR(m52Row) && isDF(m52Row) && 
                ( f3 === 'R72' || f3 === 'R58' ) && 
                'A65561' === m52Row['Article'];
        }
    },
    'DF-3-7': {
        label: "Subventions de fonctionnement",
        filter(m52Row){
            const art = m52Row['Article'];
            const f2 = m52Row['Rubrique fonctionnelle'].slice(0, 2);
            return isOR(m52Row) && isDF(m52Row) &&
                [
                    "A65731", "A65732", "A65733", "A65734", "A65735", 
                    "A65736", "A65737", "A65738", "A6574"
                ].includes(art) &&
                !(art.startsWith('A657') && (f2 !== 'R4' && f2 !== 'R5' && f2 !== 'R8'));
        }
    },
    'DF-3-8-1': {
        label: "FAJ/CAP'J",
        filter(m52Row){
            const art = m52Row['Article'];
            return isOR(m52Row) && isDF(m52Row) && (art === 'A65562' || art === 'A6556');
        }
    },
    'DF-3-8-2': { 
        label: "Bourses départementales",
        filter(m52Row){
            const f3 = m52Row['Rubrique fonctionnelle'].slice(0, 3);
            return isOR(m52Row) && isDF(m52Row) && m52Row['Article'] === 'A6513' && f3 !== 'R52';
        }
    },
    'DF-3-8-3': { 
        label: "Participation diverses",
        filter(m52Row){
            return isOR(m52Row) && isDF(m52Row) &&
            [
                "A6512", "A654", "A6541", "A6542", "A65568", 
                "A6561", "A6568", "A6581", "A65821", "A65888"
            ].includes(m52Row['Article']);
        }
    },
    'DF-4': { 
        label: "Frais de personnel",
        status: 'AMOUNT_ISSUE',
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
                !(art.startsWith('A64') && f3 === 'R51');
        }
    },
    'DF-5-1': { 
        label: "Versement au fonds de peréquations",
        filter(m52Row){
            const art = m52Row['Article'];

            return isOR(m52Row) && isDF(m52Row) && (art === 'A73914' || art === 'A73926');
        }
    },
    'DF-6-1-1': { 
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
    'DF-6-1-2': { 
        label: "Prestations de services (entretien et réparation, assurances, locations, frais divers formation colloques…)",
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
    'DF-6-1-3': { 
        label: "Frais divers (honoraires, conseils, reception, frais télécom, affranchissement, services bancaires…)",
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
    'DF-6-1-4': { 
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
    'DF-6-2': { 
        label: "Dépenses de voirie",
        status: 'TEMPORARY',
        filter(m52Row){
            const art = m52Row['Article'];
            const f4 = m52Row['Rubrique fonctionnelle'].slice(0, 4);

            return isOR(m52Row) && isDF(m52Row) &&
                f4 === 'R621' &&
                (art.startsWith('A60') || art.startsWith('A61') || art.startsWith('A62') || art.startsWith('A63'))
        }
    },


    'DF-6-3-1': { 
        label: "Questure/indemnités des élus",
        filter(m52Row){
            return isOR(m52Row) && isDF(m52Row) && 
            [
                "A65861", "A65862", "A6531", "A6532", "A6533", 
                "A6534", "A65372"
            ].includes(m52Row['Article']);
        }
    },
    'DF-6-3-2': { 
        label: "Charges exceptionnelles et provisions",
        filter(m52Row){
            const f2 = m52Row['Rubrique fonctionnelle'].slice(0, 2);
            const art = m52Row['Article'];

            return isOR(m52Row) && isDF(m52Row) && 
                (art.startsWith('A67') || art.startsWith('A68')) &&
                !(['R4', 'R5', 'R8'].includes(f2));
        }
    },
    'DF-6-3-3': { 
        label: "Autres",
        filter(m52Row){
            const art = m52Row['Article'];

            return isOR(m52Row) && isDF(m52Row) && 
                art.startsWith('A73') && 
                art !== 'A73914' && 
                art !== 'A73926';
        }
    },
    'DF-7-1': { 
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
        filter(m52Row){
            const art = m52Row['Article'];
            return isOR(m52Row) && isRI(m52Row) && 
                art !== 'A1332' && art !== 'A1341' && art !== 'A1335' && art !== 'A1345' &&
                (art.startsWith('A13') || art.startsWith('A204'))
        }
    },
    'RI-6': {
        label: "Divers",
        filter(m52Row){
            const article = m52Row['Article'];

            return isOR(m52Row) && isRI(m52Row) && 
                article !== 'A204' && 
                (
                    ["A165", "A1676", "A454121", "A454421", "A454428", "A45821", 'A1335', 'A1345'].includes(article) ||
                    ['C20', 'C21', 'C22', 'C23', 'C26', 'C27'].includes(m52Row['Chapitre'])
                )
        }
    },
    'RI-7': {
        label: "Cessions",
        filter(m52Row){
            // The choice of picking from "Recette de Fonctionnement" (RF) and not RI is deliberate
            return isOR(m52Row) && isRF(m52Row) && m52Row['Article'] === 'A775';
        }
    },
    'RI-EM-1': {
        label: "Emprunt nouveau",
        filter(m52Row){
            return isOR(m52Row) && isRI(m52Row) && ["A1641", "A16311", "A167", "A168"].includes(m52Row['Article']);
        }
    },
    'RI-EM-2': {
        label: "OCLT",
        status: 'TEMPORARY',
        filter(m52Row){
            return isOR(m52Row) && isRI(m52Row) && ["A16441"].includes(m52Row['Article']);
        }
    },

    /**
     * Dépenses d’investissement
     */


    'DI-1-1': {
        label: "Collèges",
        filter(m52Row){
            const article = m52Row['Article'];
            const fonction = m52Row['Rubrique fonctionnelle'];
            const f4 = fonction.slice(0, 4);
            
            return isOR(m52Row) && isDI(m52Row) &&
                (
                    article.startsWith('A20') ||
                    article.startsWith('A21') ||
                    article.startsWith('A23')
                ) &&
                !article.startsWith('A204') &&
                f4 === 'R221';
        }
    },
    'DI-1-2': {
        label: "Routes",
        status: 'AMOUNT_ISSUE',
        filter(m52Row){
            const article = m52Row['Article'];
            const fonction = m52Row['Rubrique fonctionnelle'];
            const f4 = fonction.slice(0, 4);
            
            return isOR(m52Row) && isDI(m52Row) &&
                (
                    article.startsWith('A20') ||
                    article.startsWith('A21') ||
                    article.startsWith('A23')
                ) &&
                !article.startsWith('A204') &&
                ['R621', 'R622', 'R628'].includes(f4)
        }
    },
    'DI-1-3': {
        label: "Bâtiments",
        status: 'TEMPORARY',
        filter(m52Row){
            const article = m52Row['Article'];
            const fonction = m52Row['Rubrique fonctionnelle'];
            const f4 = fonction.slice(0, 4);

            return isOR(m52Row) && isDI(m52Row) &&
                (
                    article.startsWith('A20') ||
                    article.startsWith('A21') ||
                    article.startsWith('A23')
                ) &&
                !article.startsWith('A204') &&
                !['R221', 'R621', 'R622', 'R628', 'R738'].includes(f4)
        }
    },
    'DI-1-4': {
        label: "Aménagement",
        filter(m52Row){
            const article = m52Row['Article'];
            const fonction = m52Row['Rubrique fonctionnelle'];
            const f4 = fonction.slice(0, 4);

            return isOR(m52Row) && isDI(m52Row) &&
                [
                    "A1311", "A1321", "A2031", "A2111", "A2157", 
                    "A2182", "A21848", "A2312", "A231351", "A2314", 
                    "A23152", "A23153"
                ].includes(m52Row['Article']) &&
                f4 === 'R738';
        }
    },
    'DI-1-5': {
        label: "Autres",
        filter(m52Row){
            const article = m52Row['Article'];
            //const otherEquipementPropreRuleIds = Object.keys(rules).filter(id => id.startsWith('DI-1') && id !== 'DI-1-4');

            return isOR(m52Row) && isDI(m52Row) && article === 'A1675';
            /* &&
            otherEquipementPropreRuleIds.every(
                id => !rules[id].filter(m52Row)
            );*/
        }
    },



    'DI-2-1': {
        label: "subventions aux communes",
        filter(m52Row){
            const article = m52Row['Article'];
            const fonction = m52Row['Rubrique fonctionnelle'];
            const f3 = fonction.slice(0, 3);
            
            return isOR(m52Row) && isDI(m52Row) &&
                f3 !== 'R72' && 
                ['A20414', 'A204141', 'A204142'].includes(article);
        }
    },
    'DI-2-2': {
        label: "logement",
        filter(m52Row){
            const article = m52Row['Article'];
            const fonction = m52Row['Rubrique fonctionnelle'];
            const f3 = fonction.slice(0, 3);

            return isOR(m52Row) && isDI(m52Row) && 
                ['A204142', 'A204182', 'A20422'].includes(article) &&
                f3 === 'R72';
        }
    },
    'DI-2-3': {
        label: "sdis",
        filter(m52Row){
            const article = m52Row['Article'];
            
            return isOR(m52Row) && isDI(m52Row) && article === 'A2041781';
        }
    },
    'DI-2-4': {
        label: "subventions tiers (hors sdis)",
        status: 'AMOUNT_ISSUE', 
        filter(m52Row){
            const article = m52Row['Article'];
            const fonction = m52Row['Rubrique fonctionnelle'];
            const f3 = fonction.slice(0, 3);

            return isOR(m52Row) && isDI(m52Row) && 
                [
                    "A204112", "A204113", "A204122", "A204131", "A204132", 
                    "A204151", "A204152", "A204162", "A2041721", "A2041722", 
                    "A2041782", "A204181", "A204182", "A204182", "A20421", 
                    "A20422", "A20431"
                ].includes(article) &&
                f3 !== 'R72' && f3 !== 'R68' && f3 !== 'R93';
        }
    },
    'DI-2-5': {
        label: "LGV",
        filter(m52Row){
            const article = m52Row['Article'];
            const fonction = m52Row['Rubrique fonctionnelle'];
            const f3 = fonction.slice(0, 3);

            return isOR(m52Row) && isDI(m52Row) && 
                "A204182" === article &&
                f3 === 'R68';
        }
    },
    'DI-2-6': {
        label: "GIRONDE Numérique",
        filter(m52Row){
            const article = m52Row['Article'];
            const fonction = m52Row['Rubrique fonctionnelle'];
            const f3 = fonction.slice(0, 3);

            return isOR(m52Row) && isDI(m52Row) && 
                "A204152" === article &&
                f3 === 'R93';
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

            return isOR(m52Row) && isDI(m52Row) && ["A16441"].includes(article);
        }
    }
});


const AggregatedInstructionRowRecord = Record({
    "id": undefined,
    "Libellé": undefined,
    "Statut": undefined,
    "M52Rows": undefined,
    "Montant": undefined
});

function makeAggregatedInstructionRowRecord(id, m52InstructionRows){
    const rule = rules[id];

    const m52Rows = m52InstructionRows.filter(rule.filter);

    return AggregatedInstructionRowRecord({
        id,
        "Libellé": rule.label,
        "Statut": rule.status,
        "M52Rows": m52Rows,
        "Montant": m52Rows.reduce(((acc, curr) => {
            return acc + curr["Montant"];
        }), 0)
    })
}

export default function convert(m52Instruction){
    return ImmutableSet(
        Object.keys(rules).map(id => makeAggregatedInstructionRowRecord(id, m52Instruction.rows))
    )
}