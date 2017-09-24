import React from 'react';

import PrimaryCallToAction from '../../../shared/js/components/gironde.fr/PrimaryCallToAction';
import Markdown from '../../../shared/js/components/Markdown';

/*
interface TotalAppetizerProps{
    total: number,
    year: number,
    totalUrl: total
}
 */

export default function ({total, year, exploreUrl}) {
    let toDisplay = '';
    let beforeAndComma;
    let afterComma;

    if(total){
        toDisplay = (total/Math.pow(10, 9)).toFixed(1);
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
                `Milliards d'euros de dépenses en ${year}`
            )
        ),
        React.createElement('hr', {}),
        React.createElement(Markdown, {}, 
            `Le département a dépensé ${toDisplay.replace('.', ',')} milliards d’euros pour les girondins en ${year}. Explorez les comptes pour comprendre d’où vient cet argent, à quoi il sert et comment il a été dépensé.`
        ),
        React.createElement(PrimaryCallToAction, { href: exploreUrl, text: 'Explorer le budget'})
    );
}
