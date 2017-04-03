import React from 'react';

/*
interface BudgetConstructionAnimationProps{
    Dotation: 100000,
    Machins: 200000,
    Impots: 300000,
    RecettesInvestissement: 400000,
    RecettesEmprunts: 500000,
    EpargneBrute: 600000,
    DepensesFonctionnement: 700000,
    FraisFinanciers: 800000,
    Investissements: 900000
}
 */

export default function ({Dotation, Machins, Impots, RecettesInvestissement, RecettesEmprunts, EpargneBrute, DepensesFonctionnement, FraisFinanciers, Investissements}) {

    return React.createElement('article', { className: 'budget-construction' },
        React.createElement('div', {className: 'bricks'}, 
            React.createElement('div', {className: 'column'}, 
                React.createElement('div', {className: 'total'}, '21'),
                React.createElement('div', {className: 'brick'}, 'YO'),
                React.createElement('div', {className: 'brick'}, 'YO'),
                React.createElement('div', {className: 'brick'}, 'YO')
            ), 
            React.createElement('div', {className: 'column'}, 
                React.createElement('div', {className: 'total'}, '21'),
                React.createElement('div', {className: 'brick'}, 'YO'),
                React.createElement('div', {className: 'brick'}, 'YO'),
                React.createElement('div', {className: 'brick'}, 'YO')
            ), 
            React.createElement('div', {className: 'column'}, 
                React.createElement('div', {className: 'total'}, '21'),
                React.createElement('div', {className: 'brick'}, 'YO'), 
                React.createElement('div', {className: 'brick'}, 'YO')
            ), 
            React.createElement('div', {className: 'column'}, 
                React.createElement('div', {className: 'total'}, '21'),
                React.createElement('div', {className: 'brick'}, 'YO')
            )
        ),
        React.createElement('hr'),
        React.createElement('dl', {className: 'texts'},
            React.createElement('div', {className: 'column'},
                React.createElement('dt', {}, 'Recettes de fonctionnement'),
                React.createElement('dd', {}, `Ces recettes proviennent principalement du produit des impôts et taxes directes et indirectes, ainsi que des dotations versées par l'État`),
                React.createElement('dt', {}, 'Emprunt'), 
                React.createElement('dd', {}, `Il permet au Département d'atteindre l’équilibre budgétaire et d’investir dans des projets d’ampleur ou durables.`)
            ), 
            React.createElement('div', {className: 'column'}, 
                React.createElement('dt', {}, 'Dépenses de fonctionnement'), 
                React.createElement('dd', {}, `Ces dépenses financent principalement les allocations et prestations sociales ou de solidarité, les services de secours (pompiers), les transports, les collèges, les routes, ainsi que le fonctionnement propre du Département (salaires et moyens) et les intérêts d’emprunts. `)
            ), 
            React.createElement('div', {className: 'column'}, 
                React.createElement('dt', {}, 'Recettes d’investissement'), 
                React.createElement('dd', {}, `Elles sont principalement constituées de dotations de l’Etat et de subventions`),
                React.createElement('dt', {}, `Dépenses d'investissement`), 
                React.createElement('dd', {}, `Elles concernent des programmes structurants ou stratégiques pour le développement du territoire girondin : bâtiments, routes, collèges, etc.`)
            )
        )
    );

}
