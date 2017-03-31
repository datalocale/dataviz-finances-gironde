import React from 'react';

/*
interface TotalAppetizerProps{
    total: number,
    year: number,
    totalUrl: total
}
 */

export default function ({total, year, totalUrl}) {

    return React.createElement('div', { className: 'appetizer total-appetizer' }, 
        React.createElement('h1', {}, 
            React.createElement('span', {className: 'total'}, (total/Math.pow(10, 9)).toFixed(3).replace('.', ',')),
            ' Milliards de dépenses en ',
            year
        ),
        React.createElement('hr', {}),
        React.createElement('p', {}, "Ce budget est composé de dépenses de fonctionnement, nécessaires aux missions et gestion des services de la collectivité, et de dépenses d’investissement dédiées à des programmes structurants ou stratégiques pour le territoire."),
        React.createElement(
            'a', 
            { href: totalUrl },
            'En savoir plus'
        )
    );
}
