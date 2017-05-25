import { List } from 'immutable';

import React from 'react';
import { connect } from 'react-redux';

import PageTitle from '../../../../shared/js/components/gironde.fr/PageTitle';

import {RF, RI, DF, DI} from '../../../../shared/js/finance/constants';
import budgetBalance from '../../../../shared/js/finance/budgetBalance';

import M52ByFonction from '../M52ByFonction';

import {EXPENDITURES, REVENUE} from '../../../../shared/js/finance/constants';

const MAX_HEIGHT = 50;

/*throw `TODO :
* make m52 legend clickable
    * Create m52 pages 'par fonction'
    * Display m52 row table in leaf pages (finance detail)
* display correct label in the legend
* 
`*/


export function TotalBudget({budget, m52Instruction, labelsById, urls: {expenditures, revenue, byFonction}}) {
    
    const max = Math.max(budget.expenditures, budget.revenue);

    const expHeight = MAX_HEIGHT*(budget.expenditures/max)+'vh'; 
    const revHeight = MAX_HEIGHT*(budget.revenue/max)+'vh'; 

    const rfHeight = 100*(budget[RF]/budget.revenue)+'%';
    const riHeight = 100*(budget[RI]/budget.revenue)+'%';
    const diHeight = 100*(budget[DI]/budget.expenditures)+'%';
    const dfHeight = 100*(budget[DF]/budget.expenditures)+'%';

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
                React.createElement('a', {href: revenue, style: {height: revHeight}}, 
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
                React.createElement('a', {href: expenditures, style: {height: expHeight}}, 
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
            m52Instruction ? React.createElement(M52ByFonction, {m52Instruction, urlByFonction: byFonction, labelsById}) : undefined,
            React.createElement(
                'a', 
                {
                    target: '_blank', 
                    href: 'https://www.datalocale.fr/dataset/comptes-administratifs-du-departement-de-la-gironde1', 
                    style: {display: 'block', textAlign: 'center', fontSize: '1.2em', transform: 'translateY(5em)'}
                }, 
                React.createElement('i', {className: "fa fa-table", ariaHidden: true}),
                ' ',
                `Télécharger les données brutes Open Data à la norme M52 au format CSV`
            )
        )



    );
}

export default connect(
    state => {
        const { m52InstructionByYear, currentYear, textsById } = state;
        const m52Instruction = m52InstructionByYear.get(currentYear);
        const budget = m52Instruction ? budgetBalance(m52Instruction) : {};

        return {
            budget,
            m52Instruction,
            labelsById: textsById.map(texts => texts.label),
            urls: {
                expenditures: '#!/finance-details/'+EXPENDITURES, 
                revenue: '#!/finance-details/'+REVENUE, 
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