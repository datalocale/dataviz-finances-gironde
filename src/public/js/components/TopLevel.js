import React from 'react';
import {format} from 'currency-formatter';


export default function({expenditures, revenue}){

    return true ? React.createElement('ul', {}, 
        React.createElement('li', {}, 'Dépenses : ', format(expenditures, { code: 'EUR' })),
        React.createElement('li', {}, 'Recettes : ', format(revenue, { code: 'EUR' }))
    ) : React.createElement('div', {});
}
