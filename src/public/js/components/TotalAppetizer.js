import React from 'react';

import PrimaryCallToAction from '../../../shared/js/components/gironde.fr/PrimaryCallToAction';

/*
interface TotalAppetizerProps{
    total: number,
    year: number,
    totalUrl: total
}
 */

export default function ({total, year, exploreUrl}) {

    let beforeAndComma;
    let afterComma;

    if(total){
        const toDisplay = (total/Math.pow(10, 9)).toFixed(1);
        beforeAndComma = toDisplay.match(/^(\d+)\./)[1];
        afterComma = toDisplay.match(/\.(\d+)$/)[1];
    }

    return React.createElement('div', { className: 'appetizer total-appetizer' }, 
        React.createElement('h1', {}, 
            total ? React.createElement('div', {className: 'number'}, 
                React.createElement('span', {className: 'before-comma'}, beforeAndComma),
                React.createElement('span', {className: 'after-comma'}, ', '+afterComma)
            ) : '',
            React.createElement('div', {className: 'text'}, 
                `Milliards de dépenses en ${year}`
            )
        ),
        React.createElement('hr', {}),
        React.createElement('p', {}, 
            `Ce budget est composé de dépenses de fonctionnement, nécessaires aux missions et gestion des services de la collectivité, et de dépenses d’investissement dédiées à des programmes structurants ou stratégiques pour le territoire.`
        ),
        React.createElement(PrimaryCallToAction, { href: exploreUrl, text: 'Explorer le budget'})
    );
}
