import { List } from 'immutable';

import React from 'react';
import { connect } from 'react-redux';

import PageTitle from '../../../../shared/js/components/gironde.fr/PageTitle';
import M52Viz from '../../../../shared/js/components/M52Viz';

import {RF, RI, DF, DI} from '../../../../shared/js/finance/constants';
import budgetBalance from '../../../../shared/js/finance/budgetBalance';
import {hierarchicalM52} from '../../../../shared/js/finance/memoized';

import {EXPENDITURES, REVENUE} from '../../../../shared/js/finance/constants';

const MAX_HEIGHT = 50;

/*throw `TODO :
* make m52 legend clickable
    * Create m52 pages 'par fonction'
    * Display m52 row table in leaf pages (finance detail)
* display correct label in the legend
* 
`*/


export function TotalBudget({budget, m52Hierarchical, labelsById, urls: {expenditures, revenue, byFonction}}) {
    
    const max = Math.max(budget.expenditures, budget.revenue);

    const expHeight = MAX_HEIGHT*(budget.expenditures/max)+'vh'; 
    const revHeight = MAX_HEIGHT*(budget.revenue/max)+'vh'; 

    const rfHeight = 100*(budget[RF]/budget.revenue)+'%';
    const riHeight = 100*(budget[RI]/budget.revenue)+'%';
    const diHeight = 100*(budget[DI]/budget.revenue)+'%';
    const dfHeight = 100*(budget[DF]/budget.revenue)+'%';

    return React.createElement('article', {className: 'explore-budget'},
        React.createElement(PageTitle, {text: 'Dépenses et Recettes du Comptes Administratif 2016'}),
        React.createElement('section', {}, `L'exécution du budget 2016, premier de la mandature du président Jean-Luc Gleyze, a été marqué par l’accentuation de la contribution des collectivités locales à la réduction des déficits publics et aux évolution du périmètre d’intervention du département suite au vote des lois MAPTAM et NOTRe. Le Département de la Gironde s’est adapté en resserrant ses marges d’autofinancement et a travaillé sur la maîtrise des dépenses de fonctionnement. Cette rigueur a permis de préserver les dépenses sociales, obligatoires et incompressibles tout en conservant les dépenses d’investissement.


Ainsi les résultats financiers de la Gironde pour cet exercice se traduisent par :
une l’épargne brute en nette amélioration, fruit notamment d’une gestion rigoureuse des dépenses de fonctionnement
une  réduction du besoin de financement par emprunt qui entraîne une baisse du ratio de financement en % des recettes de fonctionnement indicateur de la performance financière
`),
        React.createElement('section', {className: 'viz'},
            React.createElement('div', {className: 'revenue'},
                React.createElement('h1', {}, (budget.revenue/Math.pow(10, 9)).toFixed(2), ' milliards de recettes'),
                React.createElement('a', {href: revenue, style: {height: expHeight}}, 
                    React.createElement('div', {className: 'rf', style: {height: rfHeight}}, 
                        React.createElement('span', {}, 'Recettes de fonctionnement')
                    ),
                    React.createElement('div', {className: 'ri', style: {height: riHeight}},
                        React.createElement('span', {}, "Recettes d'investissement")
                    )
                )
            ),
            React.createElement('div', {className: 'expenditures'},
                React.createElement('h1', {}, (budget.expenditures/Math.pow(10, 9)).toFixed(2), ' milliards de dépenses'),
                React.createElement('a', {href: expenditures, style: {height: revHeight}}, 
                    React.createElement('div', {className: 'df', style: {height: dfHeight}}, 
                        React.createElement('span', {}, 'Dépenses de fonctionnement')
                    ),
                    React.createElement('div', {className: 'di', style: {height: diHeight}}, 
                        React.createElement('span', {}, "Dépenses d'investissement")
                    )
                )
            )
        ),
        React.createElement('section', {className: 'm52'}, 
            React.createElement('h2', {}, 'Les comptes sous la norme M52'),
            React.createElement('p', {}, `La norme M52 est la norme comptable sous laquelle tous les Départements de France doivent fournir leurs comptes.`),
            m52Hierarchical ? React.createElement('div', {className: 'm52-par-fonction'}, 
                React.createElement(M52Viz, {
                    M52Hierarchical: m52Hierarchical,
                    donutWidth: 130, 
                    outerRadius: 240,
                    /*M52HighlightedNodes,
                    selectedNode: selection && selection.type === M52_INSTRUCTION ? selection.node : undefined,
                    onSliceOvered: onM52NodeOvered,
                    onSliceSelected: onM52NodeSelected*/
                }),
                React.createElement('div', {}, 
                    React.createElement('ul', {className: 'legend'},
                        new List(m52Hierarchical.children)
                        .sort((c1, c2) => c2.total - c1.total)
                        .map((e, i) => {
                            return React.createElement('li', {},
                                React.createElement('a', {href: byFonction[e.id]},
                                    React.createElement('span', {className: `color ${e.id}`}),
                                    labelsById.get(e.id)
                                )
                            )
                        })
                    )

                )
            ) : undefined,
            React.createElement(
                'a', 
                {
                    target: '_blank', 
                    href: 'https://www.datalocale.fr/dataset/comptes-administratifs-du-departement-de-la-gironde1/resource/1e565576-bf4c-4abc-99f4-a6966f0fa8ee?inner_span=True', 
                    style: {display: 'block', textAlign: 'center', fontSize: '1.2em', transform: 'translateY(5em)'}
                }, 
                React.createElement('i', {className: "fa fa-table", ariaHidden: true}),
                ' ',
                `Télécharger les données brutes Open Data à la norme M52 au format CSV`
            )
        )



    );
}

function stripAllButFirstLevel(root){
    const children = []
    root.children.forEach(c => children.push(c));

    return Object.assign(
        {},
        root,
        {
            children: new Set(children.map(c => {
                const copy = Object.assign({}, c);
                delete copy.children;

                return copy;
            }))
        }

    )
}

export default connect(
    state => {
        const { m52InstructionByYear, currentYear, textsById } = state;
        const m52Instruction = m52InstructionByYear.get(currentYear);
        const budget = m52Instruction ? budgetBalance(m52Instruction) : {};

        const rdfi = 'DF';
        const m52Hierarchical = m52Instruction ? stripAllButFirstLevel(hierarchicalM52(m52Instruction, rdfi)) : undefined;

        return {
            budget,
            m52Hierarchical,
            labelsById: textsById.map(texts => texts.label),
            urls: {
                expenditures: '#!/finance-details/'+EXPENDITURES, 
                revenue: '#!/finance-details/'+REVENUE, 
                byFonction: {
                    'M52-DF-R0': `#!/finance-details/M52-${rdfi}-R0`,
                    'M52-DF-R1': `#!/finance-details/M52-${rdfi}-R1`,
                    'M52-DF-R2': `#!/finance-details/M52-${rdfi}-R2`,
                    'M52-DF-R3': `#!/finance-details/M52-${rdfi}-R3`,
                    'M52-DF-R4': `#!/finance-details/M52-${rdfi}-R4`,
                    'M52-DF-R5': `#!/finance-details/M52-${rdfi}-R5`,
                    'M52-DF-R6': `#!/finance-details/M52-${rdfi}-R6`,
                    'M52-DF-R7': `#!/finance-details/M52-${rdfi}-R7`,
                    'M52-DF-R8': `#!/finance-details/M52-${rdfi}-R8`,
                    'M52-DF-R9': `#!/finance-details/M52-${rdfi}-R9`
                }
            }
        };

    },
    () => ({})
)(TotalBudget);