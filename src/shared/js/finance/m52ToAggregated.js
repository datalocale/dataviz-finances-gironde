import { Record, OrderedSet as ImmutableSet } from 'immutable';
import { isRF, isDF, isRI, isDI } from './rowFilters';

/*
    This file's very French and even Gironde-specific.
    It describes, documents and encodes the rules that allows to get from
    an "M52 budget" to a "budget agrégé"
*/
export const rules = Object.freeze({

    /**
     * Recettes de fonctionnement
     */

    'RF-1-1': {
        label: 'Taxe Foncière sur les propriétés bâties+rôles supplémentaires',
        filter(m52Row) {
            const article = m52Row['Nature'];

            return isRF(m52Row) &&
                ['73111', '7318'].includes(article);
        }
    }
    ,
    'RF-1-2': {
        label: "Cotisation sur la valeur ajoutée des entreprises (CVAE)",
        filter(m52Row) {
            return isRF(m52Row) && ['7311', '73112'].includes(m52Row['Nature']);
        }
    },
    'RF-1-3': {
        label: "Imposition forfaitaire pour les entreprises de réseaux (IFER)",
        filter(m52Row) {
            return isRF(m52Row) && m52Row['Nature'] === '73114';
        }
    },
    'RF-1-4': { // should be 0 before 2016 and >0 in 2017
        label: 'Reversement CVAE Région',
        filter(m52Row) {
            return isRF(m52Row) && m52Row['Nature'] === '73123';
        }
    },
    'RF-2-1': {
        label: "Taxe Intérieure de Consommation sur les Produits Energétiques (TICPE)",
        filter(m52Row) {
            return isRF(m52Row) && '7352' === m52Row['Nature'];
        }
    },
    'RF-2-2': {
        label: "Taxe Sur les Contrats d’Assurance (TSCA)",
        filter(m52Row) {
            return isRF(m52Row) && m52Row['Nature'] === '7342';
        }
    },
    'RF-3': {
        label: "Droits de mutation à titre onéreux (DMTO)",
        filter(m52Row) {
            return isRF(m52Row) && ['7321', '7322', '7482'].includes(m52Row['Nature']);
        }
    },
    'RF-4-1': {
        label: "Taxe d'aménagement (incluant les anciennes Taxe Départementale Espaces Naturels Sensibles (TDENS) et financement CAUE)",
        filter(m52Row) {
            return isRF(m52Row) && ['7323', '7324', '7327'].includes(m52Row['Nature']);
        }
    },
    'RF-4-2': {
        label: "Taxe sur l’électricité",
        filter(m52Row) {
            return isRF(m52Row) && m52Row['Nature'] === '7351';
        }
    },
    'RF-4-3': {
        label: "Redevance des mines",
        filter(m52Row) {
            return isRF(m52Row) && m52Row['Nature'] === '7353';
        }
    },
    'RF-4-4': {
        label: "autres fiscalités",
        filter(m52Row) {
            return isRF(m52Row) && ['7362', '7388', '738'].includes(m52Row['Nature']);
        }
    },
    'RF-5-1': {
        label: "Dotation Globale de Fonctionnement (DGF)",
        filter(m52Row) {
            return isRF(m52Row) && ['7411', '74122', '74123'].includes(m52Row['Nature']);
        }
    },
    'RF-5-2': {
        label: "Dotation Globale de Décentralisation (DGD)",
        filter(m52Row) {
            return isRF(m52Row) && '7461' === m52Row['Nature'];
        }
    },
    'RF-5-3': {
        label: "Compensations fiscales",
        filter(m52Row) {
            return isRF(m52Row) && ['74833', '74834', '74835'].includes(m52Row['Nature']);
        }
    },
    'RF-5-4': {
        label: "Dotation de compensation de la réforme de la taxe professionnelle (DCRTP)",
        filter(m52Row) {
            return isRF(m52Row) && '74832' === m52Row['Nature'];
        }
    },
    'RF-5-5': {
        label: "Fonds National de Garantie Individuelle de Ressources (FNGIR)",
        filter(m52Row) {
            return isRF(m52Row) && '73121' === m52Row['Nature'];
        }
    },
    'RF-5-6': {
        label: "Autres dotations",
        filter(m52Row) {
            return isRF(m52Row) && '744' === m52Row['Nature'];
        }
    },
    'RF-6-1': {
        label: "Indus RSA",
        filter(m52Row) {
            // modifié pour le CA 2017
            return isRF(m52Row) && ['75342', '75343', '7531'].includes(m52Row['Nature']);
        }
    },
    'RF-6-2': {
        label: "Contributions de la Caisse nationale de solidarité pour l'autonomie (CNSA)",
        filter(m52Row) {
            return isRF(m52Row) && ['747811', '747812'].includes(m52Row['Nature']);
        }
    },
    'RF-6-3': {
        label: "Recouvrements sur bénéficiaires",
        filter(m52Row) {
            return isRF(m52Row) && m52Row['Nature'] === '7513';
        }
    },
    'RF-6-4': {
        // This didn't exist in 2015
        // It was new in 2016 and put in R53*A74788
        // Since 2017, it'll be as A7478141+A7478142
        label: "Conférence des financeurs",
        filter(m52Row) {
            const fonction = m52Row['Fonction'];

            return isRF(m52Row) && (
                ['7478141', '7478142'].includes(m52Row['Nature']) ||
                (m52Row['Exercice'] === 2016 && m52Row['Nature'] === '74788' && fonction === '53')
            )
        }
    },
    'RF-6-5': {
        label: "Fonds d'appui d'aide à domicile (CNSA AAD)",
        filter(m52Row) {
            const fonction = m52Row['Fonction'];

            return isRF(m52Row) && (
                // mise à jour 2019 CA 2018 74788 * F538
                ['74788'].includes(m52Row['Nature']) && fonction === '538')
        }

    },

    'RF-7-1': {
        label: "Fonds de Mobilisation Départementale pour l'Insertion (FMDI)",
        filter(m52Row) {
            return isRF(m52Row) && m52Row['Nature'] === '74783';
        }
    },
    'RF-7-2': {
        label: "Dotation de compensation peréquée DCP",
        filter(m52Row) {
            return isRF(m52Row) && m52Row['Nature'] === '73125';
        }
    },
    'RF-7-3': {
        label: "Fonds d'appui aux politiques d'insertion",
        //status: 'TEMPORARY',
        // 74718*F01 +74713*F01
        //filter(m52Row) {
        //return isRF(m52Row) && m52Row['Nature'] === 'A74788';
        //
        filter(m52Row) {
            const fonction = m52Row['Fonction'];

            return isRF(m52Row) && (
                ['74718', '74713'].includes(m52Row['Nature']) && fonction === '01')
        }
    },
    'RF-7-4': {
        label: "Fonds d'appui aux politiques d'insertion",
        status: 'TEMPORARY',
        filter(m52Row) {
            //return isRF(m52Row) && m52Row['Nature'] === 'A74718';
        }
    },
    'RF-8-1': {
        label: "Fonds de Péréquation DMTO et Fonds de solidarité",
        filter(m52Row) {
            return isRF(m52Row) && ['7326', '73261', '73262'].includes(m52Row['Nature']);
        }
    },
    'RF-8-2': {
        label: "Fonds exceptionnel pour les départements en difficulté",
        status: 'TEMPORARY',
        filter(m52Row) {
            //return isRF(m52Row) && m52Row['Nature'] === 'A74718';
        }
    },
    'RF-9-1': {
        label: "Produits des domaines (ventes)",
        filter(m52Row) {
            return isRF(m52Row) && m52Row['Nature'] === '752';
        }
    },
    'RF-9-2': {
        label: "Produits exceptionnels",
        filter(m52Row) {
            const fonction = m52Row['Fonction'];
            const f1 = fonction.slice(0, 1);
            return isRF(m52Row) &&
                // suppression pour CA 2018 f1 !== '4' && f1 !== '5' && 
                [
                    '7817', '7711', '7714', '7718',
                    '773', '7788', '7875', '7816', '7866', '7713'
                    // ajout de l'article 7866 pour le CA 2017
                    // ajour de l'article 7713 pour le CA 2018
                ].includes(m52Row['Nature']);
        }
    },
    'RF-9-3': {
        label: "Dotations et participations (dont fonds européens)",
        filter(m52Row) {
            const fonction = m52Row['Fonction'];
            const f1 = fonction.slice(0, 1);

            return isRF(m52Row) &&
                // suppression mise à jour CA 2018 f1 !== '4' && f1 !== '5' && 
                [
                    '7475', '7476', '74771', '74772', '74778',
                    // mise à jour CA 2018 '74788',
                    '74888', '74718', '7474', '7472',
                    '7473', '7478228'
                ].includes(m52Row['Nature']);
        }
    },
    'RF-9-4': {
        label: "Restauration collège",
        filter(m52Row) {
            return isRF(m52Row) && m52Row['Nature'] === '74881';
        }
    },
    'RF-9-5': {
        label: "Produits des services",
        filter(m52Row) {
            const fonction = m52Row['Fonction'];
            const f1 = fonction.slice(0, 1);

            return isRF(m52Row) &&
                // suppression mise à jour CA 2018 f1 !== '4' && f1 !== '5' 
                m52Row['Nature'].startsWith('70');
        }
    },
    'RF-9-6': {
        label: "Remboursement charges de personnels",
        filter(m52Row) {
            const fonction = m52Row['Fonction'];
            const f1 = fonction.slice(0, 1);
            return isRF(m52Row) && f1 !== '4' && f1 !== '5' && ['6419', '6459', '6479'].includes(m52Row['Nature']);
        }
    },
    'RF-9-7': {
        label: "Autres produits de gestions courants",
        filter(m52Row) {
            const fonction = m52Row['Fonction'];
            const article = m52Row['Nature'];
            const f1 = fonction.slice(0, 1);
            return isRF(m52Row) &&
                f1 !== '4' && f1 !== '5' &&
                article.startsWith('75') &&
                article !== '752' &&
                article !== '7513' &&
                article !== '75342' &&
                article !== '75343' &&
                // article exclus pour le CA 2017
                article !== '7511' &&
                article !== '7535' &&
                article !== '7533' &&
                article !== '7512' &&

                article !== '7531';
        }
    },
    'RF-9-8': {
        label: "Produits financiers",
        filter(m52Row) {
            return isRF(m52Row) && m52Row['Nature'].startsWith('76');
        }
    },

    /**
     * Dépenses de fonctionnement
     */

    'DF-1-1-1': {
        label: "Pour les personnes handicapées",
        filter(m52Row) {
            return isDF(m52Row) && ['652221', '65242'].includes(m52Row['Nature']);
        }
    },
    'DF-1-1-2': {
        label: "Frais d’hébergement - Pour les personnes âgées",
        filter(m52Row) {
            return isDF(m52Row) && ['652224', '65243'].includes(m52Row['Nature']);
        }
    },
    'DF-1-1-3': {
        label: "Liés à l’enfance",
        // Also contains R51 A65111 from a correction
        filter(m52Row) {
            const article = m52Row['Nature'];
            const fonction = m52Row['Fonction'];

            return isDF(m52Row) &&
                (
                    fonction.slice(0, 2) === '51' &&
                    (
                        [
                            "6132", "6135", "6184",
                            "6234", "6245", '6251',
                            "65221", "652222", "65223", "65228",
                            "6523", "652411", "652412", "652415", "652418",
                            "65821", "6718", "6336"
                        ].includes(article) ||
                        article.startsWith('64')
                    ) ||
                    (fonction === '50' && article === '64121') ||
                    (fonction === '50' && article === '64126')
                );
        }
    },
    'DF-1-2': {
        label: "Revenu de Solidarité Active (RSA)",
        filter(m52Row) {
            return isDF(m52Row) && ['6515', '65171', '65172'].includes(m52Row['Nature']);
        }
    },
    'DF-1-3': {
        label: "Prestation Compensatoire du Handicap (PCH) + Allocation Compensatrice aux Tierces Personnes (ACTP)",
        filter(m52Row) {
            return isDF(m52Row) && ['6511211', '6511212', '651128', '651122'].includes(m52Row['Nature']);
        }
    },
    'DF-1-4': {
        label: "Allocation Personnalisée d’Autonomie (APA)",
        filter(m52Row) {
            return isDF(m52Row) && ['651141', '651142', '651143', '651144', '651148'].includes(m52Row['Nature']);
        }
    },
    'DF-1-5': {
        label: "Préventions enfants",
        // Also contains R51 A65111 from a correction
        filter(m52Row) {
            const fonction = m52Row['Fonction'];

            return isDF(m52Row) &&
                fonction.slice(0, 2) === '51' &&
                ['652416', '6514'].includes(m52Row['Nature']);
        }
    },
    'DF-1-6': {
        label: "Subventions sociales",
        filter(m52Row) {
            const fonction = m52Row['Fonction'];
            const art = m52Row['Nature'];
            const f1 = fonction.slice(0, 1);
            return isDF(m52Row) &&
                (f1 === '4' || f1 === '5') &&
                art.startsWith('657') &&
                fonction !== '51' &&
                !(fonction === '58' && art === '6574');
        }
    },
    'DF-1-7-1': {
        label: "Autres divers enfants",
        filter(m52Row) {
            const fonction = m52Row['Fonction'];

            return isDF(m52Row) &&
                fonction.slice(0, 2) === '51' &&
                [
                    "6068", "6188", "616", "62268", "6227",
                    "62878", "654", "6541", "6542", "6568",
                    "65734", "65737", "6574", "673", "6745"
                ].includes(m52Row['Nature']);
        }
    },
    'DF-1-7-2': {
        label: "Divers social - Autres",
        filter(m52Row) {
            const fonction = m52Row['Fonction'];
            const art = m52Row['Nature'];
            const f1 = fonction.slice(0, 1);
            const parPrestationRuleIds = Object.keys(rules).filter(id => id.startsWith('DF-1-') && id !== 'DF-1-7-2');

            return isDF(m52Row) &&
                (f1 === '4' || f1 === '5') &&
                (
                    art.startsWith('60') || art.startsWith('61') || art.startsWith('62') ||
                    art.startsWith('63') || art.startsWith('65') || art.startsWith('67')
                ) &&
                parPrestationRuleIds.every(
                    id => !rules[id].filter(m52Row)
                ) &&
                !(art === '6556' && fonction === '58') &&
                !(art === '6568' && fonction === '52') &&
                !(art === '6526' && fonction === '51') &&
                !(art === '6513' && fonction === '52') &&
                !(art === '6336') &&
                !(art === '6218') &&
                !(art === '6245' && fonction === '568') &&
                !(art === '6245' && fonction === '52') &&
                !(art === '65111' && fonction === '51') &&
                !(art === '6574' && fonction === '58') &&
                !(fonction.startsWith('53') && art === '65113') &&
                !(fonction === '40' && ['614', '6132'].includes(art)) &&
                !(fonction === '50' && ['6161', '6168'].includes(art)) &&
                !(art === '6556' && fonction === '52') &&
                !(art === '6568' && fonction === '58');
        }
    },
    'DF-1-8': {
        label: "Conférence des financeurs",
        filter(m52Row) {
            const fonction = m52Row['Fonction'];
            const nature = m52Row['Nature'];

            return isDF(m52Row) &&
                (
                    fonction === '53' &&
                    nature === "65113"
                ) ||
                (
                    ['531', '532'].includes(fonction) &&
                    ['65113', '6568'].includes(nature)
                )
        }
    },
    'DF-2-1': {
        label: "Personnes en difficultés",
        filter(m52Row) {
            const article = m52Row['Nature'];
            const fonction = m52Row['Fonction'];
            const f2 = fonction.slice(0, 2);

            return isDF(m52Row) && (f2 === '54' || f2 === '56') &&
                article !== '6568' &&
                article !== '6513' &&
                !article.startsWith('64') &&
                article !== '6336' &&
                article !== '6245';
        }
    },
    'DF-2-2': {
        label: "Personnes handicapées",
        filter(m52Row) {
            const article = m52Row['Nature'];
            const fonction = m52Row['Fonction'];
            const f2 = fonction.slice(0, 2);

            return isDF(m52Row) && f2 === '52' &&
                article !== '6568' &&
                article !== '6513' &&
                !article.startsWith('64') &&
                article !== '6336' &&
                article !== '6245' &&
                !(article === '6556' && fonction === '52');
        }
    },
    'DF-2-3': {
        label: "Personnes âgées",
        filter(m52Row) {
            const article = m52Row['Nature'];
            const fonction = m52Row['Fonction'];
            const f2 = fonction.slice(0, 2);
            return isDF(m52Row) && (f2 === '55' || f2 === '53') &&
                article !== '6513' &&
                !article.startsWith('64') &&
                article !== '6336'
            // mise à jour CA 2018
            // && (article == '6245' && fonction === '538');
        }
    },
    'DF-2-4': {
        label: "Enfance",
        filter(m52Row) {
            const article = m52Row['Nature'];
            const fonction = m52Row['Fonction'];
            const f2 = fonction.slice(0, 2);
            return isDF(m52Row) &&
                (
                    (f2 === '51' && article !== '6526') ||
                    (f2 === '50' && article === '64121') ||
                    (f2 === '50' && article === '64126')
                )
        }
    },
    'DF-2-5': {
        label: "Autres",
        filter(m52Row) {
            const fonction = m52Row['Fonction'];
            const article = m52Row['Nature'];
            const f2 = fonction.slice(0, 2);

            return isDF(m52Row) &&
                ['58', '50', '40', '41', '42', '48'].includes(f2) &&
                !(article === '6556' && fonction === '58')
                && !article.startsWith('64')
                && article !== '6336' &&
                article !== '6218' &&
                !(fonction === '58' && article === '6574') &&
                !(fonction === '40' && ['614', '6132'].includes(article)) &&
                !(fonction === '50' && ['6161', '6168'].includes(article)) &&
                !(article === '6568' && fonction === '58')
        }
    },

    'DF-3-1': {
        label: "Service Départemental d'Incendie et de Secours (SDIS)",
        filter(m52Row) {
            return isDF(m52Row) && m52Row['Nature'] === '6553';
        }
    },
    'DF-3-2': {
        label: "Transports",
        filter(m52Row) {
            const f = m52Row['Fonction'];
            const f1 = f.slice(0, 1);
            const article = m52Row['Nature']

            return isDF(m52Row) && (
                (f1 === '8' && !article.startsWith('64') && article !== '6336') ||
                (
                    f === '568' &&
                    (
                        article === '6245' ||
                        article === '6336' ||
                        article === '6218'
                    )
                )
            )
        }
    },
    'DF-3-3': {
        label: "Transports des étudiants et des élèves handicapés",
        filter(m52Row, Exer) {
            const fonction = m52Row['Fonction'];
            const nature = m52Row['Nature'];
            const f2 = fonction.slice(0, 2);

            return isDF(m52Row) &&
                f2 === '52' &&
                ['6245', '6513', '6568'].includes(nature) &&
                !(Exer >= 2017 && nature === '6568' && fonction === '52');
        }
    },
    'DF-3-4': {
        label: "Prévention spécialisée",
        filter(m52Row) {
            const f = m52Row['Fonction'];
            return isDF(m52Row) && ['6526', '6563'].includes(m52Row['Nature']) && f === '51';
        }
    },
    'DF-3-5': {
        label: "Dotation de fonctionnement des collèges",
        filter(m52Row) {
            return isDF(m52Row) && ['65511', '65512'].includes(m52Row['Nature']);
        }
    },
    'DF-3-6': {
        label: "Subventions de fonctionnement",
        filter(m52Row) {
            const art = m52Row['Nature'];
            const fonction = m52Row['Fonction']
            const f1 = fonction.slice(0, 1);
            return isDF(m52Row) &&
                (
                    [
                        "65731", "65732", "65733", "65734", "65735",
                        "65736", "65737", "65738", "6574"
                    ].includes(art) &&
                    !(art.startsWith('657') && (f1 === '4' || f1 === '5' || f1 === '8'))
                )
        }
    },
    'DF-3-7-1': {
        label: "Fond social logement FSL",
        filter(m52Row) {
            const f2 = m52Row['Fonction'].slice(0, 2);

            return isDF(m52Row) &&
                (f2 === '72') &&
                ('6556' === m52Row['Nature'] ||
                    '65561' === m52Row['Nature']);
        }
    },
    'DF-3-7-2': {
        label: "Bourses départementales",
        filter(m52Row) {
            const f2 = m52Row['Fonction'].slice(0, 2);
            return isDF(m52Row) && m52Row['Nature'] === '6513' &&
                f2 !== '52' && f2 !== '81';
        }
    },
    'DF-3-7-3': {
        label: "Participation diverses",
        filter(m52Row) {
            const fonction = m52Row['Fonction']
            const nature = m52Row['Nature']
            const f1 = fonction.slice(0, 1);
            const f2 = fonction.slice(0, 2);

            return isDF(m52Row) &&
                (
                    (
                        f1 !== '4' && f1 !== '5' && f1 !== '8' &&
                        ['6512', '65568'].includes(nature)
                    ) ||
                    (
                        f1 !== '4' && f1 !== '5' && f1 !== '8' && f2 !== '91' &&
                        ['6561', '6568'].includes(nature)
                    ) ||
                    (nature === '6556' && fonction === '58') ||
                    (nature === '6556' && fonction === '52') ||
                    (nature === '6568' && fonction === '58')
                )
        }
    },
    'DF-4': {
        label: "Frais de personnel",
        filter(m52Row, exer) {
            const chap = m52Row['Chapitre'];
            const art = m52Row['Nature'];
            const f = m52Row['Fonction'];
            const f2 = f.slice(0, 2);

            return isDF(m52Row) &&
                (
                    (
                        chap === '012' ||
                        (
                            (art.startsWith('64') || art === '6218' || art === '6336') &&
                            (chap === '015' || chap === '016' || chap === '017')
                        )
                    ) &&
                    !((art.startsWith('64') || art === '6336') && f2 === '51') &&
                    !(art === '6336' && f === '568') &&
                    !((art === '64126' || art === '64121') && f2 === '50') &&
                    !(
                        // These lines should be added only for 2017 and later
                        exer < 2017 &&
                        (
                            (art === '6451' && f === '50') ||
                            (art === '6453' && f === '50') ||
                            (art === '6454' && f === '50')
                        )
                    )
                )

        }
    },
    'DF-5': {
        label: "Péréquation verticale",
        filter(m52Row) {
            const art = m52Row['Nature'];

            return isDF(m52Row) &&
                ['73913', '73914', '73926', '739261', '739262'].includes(art);
        }
    },
    'DF-6-1-1': {
        label: "Achats et fournitures",
        filter(m52Row) {
            const f3 = m52Row['Fonction'].slice(0, 3);
            const f1 = m52Row['Fonction'].slice(0, 1);
            const art = m52Row['Nature'];

            return isDF(m52Row) && art.startsWith('60') &&
                !(['4', '5', '8'].includes(f1)) &&
                !(f3 === '621');
        }
    },
    'DF-6-1-2': {
        label: "Prestations de services (entretien et réparation, assurances, locations, frais divers, formation, colloques…)",
        filter(m52Row) {
            const fonction = m52Row['Fonction']
            const f3 = fonction.slice(0, 3);
            const f1 = fonction.slice(0, 1);
            const art = m52Row['Nature'];

            return isDF(m52Row) &&
                (
                    (
                        art.startsWith('61') &&
                        !(['4', '5', '8'].includes(f1)) &&
                        !(f3 === '621')
                    ) ||
                    (fonction === '40' && ['614', '6132'].includes(art)) ||
                    (fonction === '50' && ['6161', '6168'].includes(art))
                )
        }
    },
    'DF-6-1-3': {
        label: "Frais divers (honoraires, conseils, reception, frais télécom, affranchissement, services bancaires…)",
        filter(m52Row) {
            const f3 = m52Row['Fonction'].slice(0, 3);
            const f1 = m52Row['Fonction'].slice(0, 1);
            const art = m52Row['Nature'];

            return isDF(m52Row) &&
                art.startsWith('62') &&
                !(['4', '5', '8'].includes(f1)) &&
                !(f3 === '621') &&
                art !== '6218' &&
                //mise à jour CA 2018
                (art === '6251' && f3 === '621');
        }
    },
    'DF-6-1-4': {
        label: "Autres impôts et taxes",
        filter(m52Row) {
            const f3 = m52Row['Fonction'].slice(0, 3);
            const f1 = m52Row['Fonction'].slice(0, 1);
            const art = m52Row['Nature'];

            return isDF(m52Row) &&
                art.startsWith('63') &&
                !(['4', '5', '8'].includes(f1)) &&
                !(f3 === '621') &&
                art !== '6336';
        }
    },
    'DF-6-2': {
        label: "Dépenses de voirie",
        filter(m52Row) {
            const art = m52Row['Nature'];
            const f3 = m52Row['Fonction'].slice(0, 3);

            return isDF(m52Row) &&
                f3 === '621' &&
                (art.startsWith('60') || art.startsWith('61') || art.startsWith('62') || art.startsWith('63')) &&
                art !== '6336' &&
                art !== '6215' &&
                //mise à jour CA 2018
                !(art === '6251' && f3 === '621');
        }
    },


    'DF-6-3-1': {
        label: "Questure/indemnités des élus",
        filter(m52Row) {
            return isDF(m52Row) &&
                [
                    "65861", "65862", "6531", "6532", "6533",
                    "6534", "65372", '6535'
                ].includes(m52Row['Nature']);
        }
    },
    'DF-6-3-2': {
        label: "Charges exceptionnelles et provisions",
        filter(m52Row) {
            const f1 = m52Row['Fonction'].slice(0, 1);
            const art = m52Row['Nature'];

            return isDF(m52Row) &&
                (art.startsWith('67') || art.startsWith('68')) &&
                !(['4', '5', '8'].includes(f1));
        }
    },
    'DF-6-3-3': {
        label: "Autres",
        filter(m52Row) {
            const f1 = m52Row['Fonction'].slice(0, 1);
            const art = m52Row['Nature'];

            return isDF(m52Row) &&
                (
                    (art.startsWith('73') &&
                        !['73913', '73914', '73926', '739261', '739262'].includes(art)
                    ) ||
                    ['654', '6541', '6542', '6581', '65821', '65888', '65661'].includes(art)
                ) &&
                !(['4', '5', '8'].includes(f1));
        }
    },
    'DF-6-4': {
        label: "Dotations transferts",
        filter(m52Row) {
            const art = m52Row['Nature'];
            const f2 = m52Row['Fonction'].slice(0, 2);

            return isDF(m52Row) &&
                (
                    f2 === '91' &&
                    ['6561', '6568'].includes(art)
                ) ||
                ['65542'].includes(m52Row['Nature']);
        }
    },
    'DF-7': {
        label: "Intérêts des emprunts",
        filter(m52Row) {
            return isDF(m52Row) && m52Row['Nature'].startsWith('66');
        }
    },

    /**
     * Recettes d’investissement
     */

    'RI-1': {
        label: "Fonds de Compensation de la Taxe sur la Valeur Ajoutée (FCTVA)",
        filter(m52Row) {
            return isRI(m52Row) && m52Row['Nature'] === '10222';
        }
    },
    'RI-2': {
        label: "Dotation Décentralisée pour l’Equipement des collèges (DDEC)",
        filter(m52Row) {
            return isRI(m52Row) && m52Row['Nature'] === '1332';
        }
    },
    'RI-3': {
        label: "Dotation Globale d’Equipement (DGE)",
        filter(m52Row) {
            return isRI(m52Row) && (m52Row['Nature'] === '1341' || m52Row['Nature'] === '10221');
        }
    },
    'RI-4': {
        label: "Subventions",
        filter(m52Row) {
            const art = m52Row['Nature'];
            return isRI(m52Row) &&
                art !== '1332' && art !== '1341' && art !== '1335' && art !== '1345' &&
                (art.startsWith('13')
                    // modif CA 2018 || art.startsWith('204')
                )
        }
    },
    'RI-5': {
        label: "Divers",
        filter(m52Row) {
            const article = m52Row['Nature'];

            return isRI(m52Row) &&
                // mise à jour CA 2018 article !== '204' 
                article === '204' &&
                (
                    ["165", "1676", "454121", "454421", "454428", "45821", '1335', '1345'].includes(article) ||
                    ['20', '21', '22', '23', '26', '27'].includes(m52Row['Chapitre'])
                )
        }
    },
    'RI-6': {
        label: "Cessions",
        filter(m52Row) {
            // The choice of picking from "Recette de Fonctionnement" (RF) and not RI is deliberate
            return isRF(m52Row) && m52Row['Nature'] === '775';
        }
    },
    'RI-7': {
        label: "Amendes radars automatiques",
        filter(m52Row) {
            const article = m52Row['Nature'];
            // The choice of picking from "Recette de Fonctionnement" (RF) and not RI is deliberate
            return isRI(m52Row) && ['1335', '1345'].includes(article);
        }
    },
    'RI-EM-1': {
        label: "Emprunt nouveau",
        filter(m52Row) {
            return isRI(m52Row) && ["1641", "16311", "167", "168", "1631", "16811"].includes(m52Row['Nature']);
        }
    },
    'RI-EM-2': {
        label: "OCLT",
        filter(m52Row) {
            return isRI(m52Row) && ["16441"].includes(m52Row['Nature']);
        }
    },

    /**
     * Dépenses d’investissement
     */


    'DI-1-1': {
        label: "Collèges",
        filter(m52Row) {
            const article = m52Row['Nature'];
            const fonction = m52Row['Fonction'];
            const f3 = fonction.slice(0, 3);

            return isDI(m52Row) &&
                (
                    f3 === '221' &&
                    (
                        article.startsWith('20') ||
                        article.startsWith('21') ||
                        article.startsWith('23')
                    ) &&
                    !article.startsWith('204')
                ) ||
                (
                    fonction === '21' &&
                    (
                        ['2031', '21838', '2157', '21831', '21841'].includes(article)
                    )
                )
        }
    },
    'DI-1-2': {
        label: "Routes",
        filter(m52Row) {
            const article = m52Row['Nature'];
            const fonction = m52Row['Fonction'];

            return isDI(m52Row) &&
                (
                    (
                        fonction === '621' &&
                        (
                            article.startsWith('20') ||
                            article.startsWith('21') ||
                            article.startsWith('23') ||
                            article === '1321' ||
                            article === '1324'
                        )
                    ) ||
                    (fonction === '18' && article === '23153') ||
                    (fonction === '52' && ['23151', '2315', '2118', '23152'].includes(article)) ||
                    (fonction === '821' && article === '1322') ||
                    // mise à jour CA 2018 
                    (fonction === '33' && article === '23153')
                ) &&
                !(fonction === '621' && ['2111', '231318', '204182'].includes(article))
        }
    },
    'DI-1-3': {
        label: "Bâtiments",
        filter(m52Row) {
            const article = m52Row['Nature'];
            const fonction = m52Row['Fonction'];

            return isDI(m52Row) &&
                (
                    (
                        (
                            article.startsWith('20') ||
                            article.startsWith('21') ||
                            article.startsWith('23') ||
                            article === '1321' ||
                            article === '1324'
                        ) &&
                        !['221', '621', '738', '50'].includes(fonction)
                    ) ||
                    (
                        (
                            article === '2111' ||
                            article === '231318'
                        ) &&
                        fonction === '621'
                    ) ||
                    (fonction === '52' && article === '2315') ||
                    (fonction === '50' && article === '231351') ||
                    (fonction === '01' && article === '2761') ||
                    (fonction === '01' && article === '2748')
                ) &&
                !(article === '21313' && fonction === '40') &&
                !(article === '1322' && fonction === '821') &&
                !(article === '23151' && fonction === '52') &&
                !(article === '2188' && fonction === '41') &&
                !(
                    (
                        article === '2031' ||
                        article === '21838'
                    ) &&
                    fonction === '21'
                ) &&
                // mise à jour CA 2018
                (article === '2764' && fonction === '91') &&
                !(article === '23153' && fonction === '18') &&
                !article.startsWith('204');
        }
    },
    'DI-1-4': {
        label: "Aménagement",
        filter(m52Row) {
            const article = m52Row['Nature'];
            const fonction = m52Row['Fonction'];
            const f3 = fonction.slice(0, 3);

            return isDI(m52Row) &&
                (
                    ([
                        "1311", "2031", "2111", "2157",
                        "2182", "21848", "2312", "231351", "2314",
                        "23152", "23153",
                        //ajout article CA 2018
                        "2051"
                    ].includes(article) &&
                        f3 === '738') ||
                    article === '45441'
                );
        }
    },
    'DI-1-5': {
        label: "Immobilier Social",
        filter(m52Row) {
            const article = m52Row['Nature'];
            const fonction = m52Row['Fonction'];

            return isDI(m52Row) &&
                (
                    article === '1675' ||
                    (
                        (
                            fonction === '50' &&
                            (
                                article.startsWith('20') ||
                                article.startsWith('21') ||
                                article.startsWith('23')
                            ) &&
                            !article.startsWith('204')
                        )
                    ) ||
                    (fonction === '40' && article === '21313') ||
                    (fonction === '41' && article === '2188')
                ) &&
                !(fonction === '50' && article === '231351')
        }
    },



    'DI-2-1': {
        label: "subventions aux communes",
        filter(m52Row) {
            const article = m52Row['Nature'];
            const fonction = m52Row['Fonction'];
            const f2 = fonction.slice(0, 2);

            return isDI(m52Row) &&
                f2 !== '72' &&
                ['20414', '204141', '204142'].includes(article);
        }
    },
    'DI-2-2': {
        label: "logement",
        filter(m52Row) {
            const article = m52Row['Nature'];
            const fonction = m52Row['Fonction'];
            const f2 = fonction.slice(0, 2);

            return isDI(m52Row) &&
                ['204142', '204182', '20422'].includes(article) &&
                f2 === '72';
        }
    },
    'DI-2-3': {
        label: "sdis",
        filter(m52Row) {
            const article = m52Row['Nature'];

            return isDI(m52Row) && article === '2041781';
        }
    },
    'DI-2-4': {
        label: "subventions tiers (hors sdis)",
        filter(m52Row) {
            const article = m52Row['Nature'];
            const fonction = m52Row['Fonction'];

            return isDI(m52Row) &&
                [
                    "204112", "204113", "204122", "204131", "204132",
                    "204151", "204152", "204162", "2041721", "2041722",
                    "2041782", "204181", "204182",
                    "20422", "20431", '2761', '261', '20421', '204183',
                    '204113', '1321', '2748', '1328', '13278',
                    //ajout article CA 2018
                    '204153'
                ].includes(article) &&
                fonction !== '72' &&
                !(article === '204152' && fonction === '93') &&
                !(article === '1321' && ['621', '18'].includes(fonction)) &&
                !(article === '204182' && fonction === '68') &&
                !(article === '2761' && fonction === '01') &&
                !(article === '2748' && fonction === '01');
        }
    },
    'DI-2-5': {
        label: "LGV",
        filter(m52Row) {
            const article = m52Row['Nature'];
            const fonction = m52Row['Fonction'];
            const f2 = fonction.slice(0, 2);

            return isDI(m52Row) &&
                "204182" === article &&
                f2 === '68';
        }
    },
    'DI-2-6': {
        label: "Gironde Numérique",
        filter(m52Row) {
            const article = m52Row['Nature'];
            const fonction = m52Row['Fonction'];
            const f2 = fonction.slice(0, 2);

            return isDI(m52Row) &&
                "204152" === article &&
                f2 === '93';
        }
    },

    'DI-EM-1': {
        label: "Amortissement emprunt",
        filter(m52Row) {
            const article = m52Row['Nature'];

            return isDI(m52Row) && ["1641", "16311", "167", "168", '16811'].includes(article);
        }
    },
    'DI-EM-2': {
        label: "Amortissement OCLT",
        filter(m52Row) {
            const article = m52Row['Nature'];

            return isDI(m52Row) && ["16441"].includes(article);
        }
    },
    'DI-EM-3': {
        label: "Divers emprunts",
        filter(m52Row) {
            const article = m52Row['Nature'];

            return isDI(m52Row) && ['1672', '165', '275'].includes(article);
        }
    },

    // 2 lignes en DI et RI qui s'annulent
    'REAM-OCLT-1': {
        label: "Refinancement dette",
        filter(m52Row) {
            const article = m52Row['Nature'];

            return (isDI(m52Row) || isRI(m52Row)) && article === '166';
        }
    },
    // 2 lignes en DI et RI qui s'annulent
    'REAM-OCLT-2': {
        label: "Opération tirage ligne de trésorerie",
        filter(m52Row) {
            const article = m52Row['Nature'];

            return (isDI(m52Row) || isRI(m52Row)) && article === '16449';
        }
    },

    'EXC': {
        label: "Excédents",
        filter(m52Row) {
            const article = m52Row['Nature'];

            return isRI(m52Row) && article === '1068';
        }
    }
});



const AggregatedInstructionRowRecord = Record({
    "id": undefined,
    "Libellé": undefined,
    "Statut": undefined,
    "M52Rows": undefined,
    "Montant": 0
});



function makeAggregatedInstructionRowRecord(id, rows, corrections, exer) {
    const rule = rules[id];

    let relevantDocBudgRows = rows.filter(r => rule.filter(r, exer)).union(corrections);

    return AggregatedInstructionRowRecord({
        id,
        "Libellé": rule.label,
        "Statut": rule.status,
        "M52Rows": relevantDocBudgRows,
        "Montant": relevantDocBudgRows.reduce(((acc, r) => {
            return acc + r["MtReal"];
        }), 0)
    })
}

export default function convert(docBudg, corrections = []) {

    const yearCorrections = corrections.filter(c => c['Exer'] === docBudg['Exer']);

    return ImmutableSet(
        Object.keys(rules)
            .map(id => makeAggregatedInstructionRowRecord(
                id,
                docBudg.rows,
                yearCorrections.filter(c => c['splitFor'] === id),
                docBudg['Exer']
            ))
    )
}
