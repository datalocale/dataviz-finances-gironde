import React from 'react';
import { connect } from 'react-redux';

/*

interface FocusSolidarityProps{
    % de la dépense solidarité dans le budget

}

*/


export function FocusSol({}) {

    return React.createElement('article', {className: 'focus'},
        React.createElement('section', {}, 
            React.createElement('h1', {}, 'Solidarité'),
            React.createElement('p', {}, 
                `Face à l’augmentation croissante des situations d’exclusion et de précarité, le Département affirme sa vocation sociale et poursuit avec détermination des politiques concertées et innovantes en particulier dans le domaine de l’insertion et l’accompagnement des personnes en difficultés.`,
                React.createElement('strong', {}, `PRECISER L'ANNEE XX%`),
                ` du total des dépenses de fonctionnement du département sont dédiées aux allocations et prestations sociales ou de solidarité.`
            )
        ),
        React.createElement('section', {}, 
            React.createElement('Donut'),
            React.createElement('paragraphs'),
            React.createElement('fraction')
        ),
        React.createElement('section', {}, 
            React.createElement('h2', {}, `Les moyens d'action`),
            React.createElement('p', {}, `bla bla bla`),
            React.createElement('p', {}, `bla bla bla`),
            React.createElement('p', {}, `bla bla bla`)
        ),
        React.createElement('section', {}, 
            React.createElement('h2', {}, `Evolution des dépenses de “Solidarités” par prestation de XXX à YYY`),
            React.createElement('stacked-bar', {})
        ),
        React.createElement('section', {}, 
            React.createElement('h2', {}, `Les publics`),
            React.createElement('p', {}, `bla bla bla`),
            React.createElement('detail-audience-1'),
            React.createElement('detail-audience-2'),
            React.createElement('detail-audience-3'),
            React.createElement('detail-audience-4')
        )
    );

}

export default connect(
    state => {
        const { breadcrumb } = state;
        return {focusId: breadcrumb.last()};
    },
    () => ({})
)(FocusSol);