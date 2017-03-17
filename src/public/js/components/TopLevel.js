import React from 'react';


export default function({expenditures, revenue}){

    return true ? React.createElement('ul', {}, 
        React.createElement('li', {}, 'Dépenses : ', expenditures),
        React.createElement('li', {}, 'Recettes : ', revenue)
    ) : React.createElement('div', {});
}
