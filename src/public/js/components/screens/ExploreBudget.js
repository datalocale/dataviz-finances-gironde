import { Map as ImmutableMap } from 'immutable';

import React from 'react';
import { connect } from 'react-redux';

import { sum } from 'd3-array';

import {RF, RI, DF, DI, EXPENDITURES, REVENUE} from '../../../../shared/js/finance/constants';

import {m52ToAggregated, hierarchicalAggregated}  from '../../../../shared/js/finance/memoized';
import {flattenTree} from '../../../../shared/js/finance/visitHierarchical.js';

import M52ByFonction from '../M52ByFonction';

import PageTitle from '../../../../shared/js/components/gironde.fr/PageTitle';
import SecundaryTitle from '../../../../shared/js/components/gironde.fr/SecundaryTitle';
import DownloadSection from '../../../../shared/js/components/gironde.fr/DownloadSection';
import PrimaryCallToAction from '../../../../shared/js/components/gironde.fr/PrimaryCallToAction';
import Markdown from '../../../../shared/js/components/Markdown';

import BudgetConstructionAnimation from '../BudgetConstructionAnimation'

const MAX_HEIGHT = 30;


function displayMillions(amount){
    return `${(amount/1000000).toFixed(0)} millions`;
}

export function TotalBudget({
    currentYear, totalById, m52Instruction, labelsById,
    urls: {expenditures: expURL, revenue: revURL, rf, ri, df, di, byFonction},
    constructionAmounts}) {
    const expenditures = totalById.get(EXPENDITURES)
    const revenue = totalById.get(REVENUE)

    const max = Math.max(expenditures, revenue);

    const expHeight = MAX_HEIGHT*(expenditures/max)+'em';
    const revHeight = MAX_HEIGHT*(revenue/max)+'em';

    const rfHeight = 100*(totalById.get(RF)/revenue)+'%';
    const riHeight = 100*(totalById.get(RI)/revenue)+'%';
    const diHeight = 100*(totalById.get(DI)/expenditures)+'%';
    const dfHeight = 100*(totalById.get(DF)/expenditures)+'%';

    return React.createElement('article', {className: 'explore-budget'},
        React.createElement(PageTitle, {text: `Exploration des comptes ${currentYear}`}),
        React.createElement('section', {},
            React.createElement(Markdown, {}, `L'exécution du budget 2016, premier de la mandature du président Jean-Luc Gleyze, a été marqué par l’augmentation de la contribution des collectivités locales à la réduction des déficits publics et aux évolution du périmètre d’intervention du département suite au vote des lois MAPTAM et NOTRe. Le Département de la Gironde s’est adapté en resserrant ses marges d’autofinancement et a travaillé sur la maîtrise des dépenses de fonctionnement. Cette rigueur a permis de préserver les dépenses sociales, obligatoires et incompressibles tout en conservant les dépenses d’investissement.
                
            Ainsi les résultats financiers de la Gironde pour cet exercice se traduisent par :
            - une l’épargne brute en nette amélioration, fruit notamment d’une gestion rigoureuse des dépenses de fonctionnement
            - une réduction du besoin de financement par emprunt qui entraîne une baisse du ratio de financement en % des recettes de fonctionnement indicateur de la performance financière`
            )
        ),

        React.createElement('section', {},
            React.createElement(SecundaryTitle, {text: 'Les grandes masses budgétaires du compte administratif'}),
            React.createElement('div', {className: 'viz'},
                React.createElement('div', {className: 'revenue'},
                    React.createElement('h1', {}, 'Recettes'),
                    React.createElement('div', {},
                        React.createElement('div', {className: 'areas', style: {height: revHeight}},
                            React.createElement('a', {className: 'rf', href: rf, style: {height: rfHeight}},
                                React.createElement('h2', {}, "Recettes de fonctionnement"),
                                React.createElement('h3', {}, displayMillions(totalById.get(RF)))
                            ),
                            React.createElement('a', {className: 'ri', href: ri, style: {height: riHeight}},
                                React.createElement('h2', {}, "Recettes d'investissement"),
                                React.createElement('h3', {}, displayMillions(totalById.get(RI)))
                            )
                        ),
                        React.createElement('div', {className: 'texts', style: {height: revHeight}},
                            React.createElement('div', {},
                                React.createElement('div', {className: 'amount'}, (revenue/Math.pow(10, 9)).toFixed(2).replace('.', ',')),
                                React.createElement('div', {className: 'unit'}, `milliards d'euros`)
                            ),
                            React.createElement(PrimaryCallToAction, {text: `en savoir plus`, href: revURL})
                        )
                    )
                ),
                React.createElement('div', {className: 'expenditures'},
                    React.createElement('h1', {}, 'Dépenses'),
                    React.createElement('div', {},
                        React.createElement('div', {className: 'areas', style: {height: expHeight}},
                            React.createElement('a', {className: 'df', href: df, style: {height: dfHeight}},
                                React.createElement('h2', {}, "Dépenses de fonctionnement"),
                                React.createElement('h3', {}, displayMillions(totalById.get(DF)))
                            ),
                            React.createElement('a', {className: 'di', href: di, style: {height: diHeight}},
                                React.createElement('h2', {}, "Dépenses d'investissement"),
                                React.createElement('h3', {}, displayMillions(totalById.get(DI)))
                            )
                        ),
                        React.createElement('div', {className: 'texts', style: {height: expHeight}},
                            React.createElement('div', {},
                                React.createElement('div', {className: 'amount'}, (expenditures/Math.pow(10, 9)).toFixed(2).replace('.', ',')),
                                React.createElement('div', {className: 'unit'}, `milliards d'euros`)
                            ),
                            React.createElement(PrimaryCallToAction, {text: `en savoir plus`, href: expURL})
                        )                   
                    )
                )
            ),
            React.createElement(Markdown, {},
            `Les chiffres étant issus du compte administratif, la différence entre le montant des recettes et le montant des dépenses représente l'excédent de l'exercice.`
            )  
        ),
        React.createElement('section', {},
            React.createElement(SecundaryTitle, {text: `Comprendre la construction d'un budget`}),
            React.createElement(Markdown, {},
                `Le budget prévoit la répartition des recettes et des dépenses sur un exercice. Il est composé de la section de fonctionnement et d’investissement. Contrairement à l’Etat, les Départements, ont l’obligation d’adopter un budget à l’équilibre. Toutefois, le compte administratif peut présenter sur l'exercice un résultat excédentaire ou déficitaire.`
            ),
            React.createElement(Markdown, {},
                `Dans un contexte particulièrement contraint, la préservation de nos équilibres financiers constitue un défi stimulant. Alors comment s’établit notre budget ?`
            ),
            React.createElement(
                BudgetConstructionAnimation,
                constructionAmounts
            )
        ),
        React.createElement('section', {className: 'm52'},
            React.createElement(SecundaryTitle, {text: 'Les comptes par fonction (norme M52)'}),
            m52Instruction ? React.createElement(M52ByFonction, {m52Instruction, urlByFonction: byFonction, labelsById}) : undefined,
            React.createElement(
                DownloadSection,
                {
                    title: `Données brutes sur datalocale.fr`,
                    items: [
                        {
                            text: 'Comptes administratifs du Département de la Gironde',
                            url: 'https://www.datalocale.fr/dataset/comptes-administratifs-du-departement-de-la-gironde'
                        }
                    ]
                }
            )
        ),
    );
}

export default connect(
    state => {
        const { m52InstructionByYear, currentYear, textsById } = state;
        const m52Instruction = m52InstructionByYear.get(currentYear);
        const aggregated = m52Instruction && m52ToAggregated(m52Instruction);
        const hierAgg = m52Instruction && hierarchicalAggregated(aggregated);

        let totalById = new ImmutableMap();
        if(hierAgg){
            flattenTree(hierAgg).forEach(aggHierNode => {
                totalById = totalById.set(aggHierNode.id, aggHierNode.total);
            });
        }

        return {
            currentYear,
            totalById,
            m52Instruction,
            labelsById: textsById.map(texts => texts.label),
            // All of this is poorly hardcoded. TODO: code proper formulas based on what was transmitted by CD33
            constructionAmounts: m52Instruction ? {
                DotationEtat: totalById.get('RF-5'),
                FiscalitéDirecte: totalById.get('RF-1'),
                FiscalitéIndirecte: totalById.get('RF-2'),
                RecettesDiverses: totalById.get('RF') - sum(['RF-1', 'RF-2', 'RF-5'].map(i => totalById.get(i))),

                Solidarité: totalById.get('DF-1'),
                Interventions: totalById.get('DF-3') + totalById.get('DF-4'),
                DépensesStructure: (totalById.get('DF') - sum(['DF-1', 'DF-3', 'DF-4'].map(i => totalById.get(i)))),

                Emprunt: totalById.get('RI-EM'),
                RIPropre: (totalById.get('RI') - totalById.get('RI-EM')),

                RemboursementEmprunt: totalById.get('DI-EM'),
                Routes: totalById.get('DI-1-2'),
                Colleges: totalById.get('DI-1-1'),
                Amenagement: totalById.get('DI-1-3') + totalById.get('DI-1-4') + totalById.get('DI-1-5'),
                Subventions: totalById.get('DI-2')
            } : undefined,
            urls: {
                expenditures: '#!/finance-details/'+EXPENDITURES,
                revenue: '#!/finance-details/'+REVENUE,
                rf: '#!/finance-details/'+RF,
                ri: '#!/finance-details/'+RI,
                df: '#!/finance-details/'+DF,
                di: '#!/finance-details/'+DI,
                byFonction: {
                    'M52-DF-R0': `#!/finance-details/M52-DF-R0`,
                    'M52-DF-R1': `#!/finance-details/M52-DF-R1`,
                    'M52-DF-R2': `#!/finance-details/M52-DF-R2`,
                    'M52-DF-R3': `#!/finance-details/M52-DF-R3`,
                    'M52-DF-R4': `#!/finance-details/M52-DF-R4`,
                    'M52-DF-R5': `#!/finance-details/M52-DF-R5`,
                    'M52-DF-R6': `#!/finance-details/M52-DF-R6`,
                    'M52-DF-R7': `#!/finance-details/M52-DF-R7`,
                    'M52-DF-R8': `#!/finance-details/M52-DF-R8`,
                    'M52-DF-R9': `#!/finance-details/M52-DF-R9`,
                    'M52-DI-R0': `#!/finance-details/M52-DI-R0`,
                    'M52-DI-R1': `#!/finance-details/M52-DI-R1`,
                    'M52-DI-R2': `#!/finance-details/M52-DI-R2`,
                    'M52-DI-R3': `#!/finance-details/M52-DI-R3`,
                    'M52-DI-R4': `#!/finance-details/M52-DI-R4`,
                    'M52-DI-R5': `#!/finance-details/M52-DI-R5`,
                    'M52-DI-R6': `#!/finance-details/M52-DI-R6`,
                    'M52-DI-R7': `#!/finance-details/M52-DI-R7`,
                    'M52-DI-R8': `#!/finance-details/M52-DI-R8`,
                    'M52-DI-R9': `#!/finance-details/M52-DI-R9`
                }
            }
        };

    },
    () => ({})
)(TotalBudget);
