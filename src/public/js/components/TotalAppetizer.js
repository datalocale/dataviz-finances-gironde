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

    return React.createElement('div', { className: 'appetizer total-appetizer' }, 
        React.createElement('h1', {}, 
            React.createElement('div', {className: 'number'}, 
                total ? (total/Math.pow(10, 9)).toFixed(1).replace('.', ',') : ''
            ),
            React.createElement('div', {className: 'text'}, 
                `Milliards de dépenses en ${year}`
            )
        ),
        React.createElement('hr', {}),
        React.createElement('p', {}, 
            `Le département a dépensé 1,6 milliards d’euros pour les girondins en 2016. Explorez les comptes pour comprendre d’où vient cet argent, à quoi il sert et comment il a été dépensé.`
        ),
        React.createElement(PrimaryCallToAction, { href: exploreUrl, text: 'Explorer le budget'})
    );
}
