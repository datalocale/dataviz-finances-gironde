import React from 'react';

import PrimaryCallToAction from '../../../shared/js/components/gironde.fr/PrimaryCallToAction';
import AppetizerTitle from './AppetizerTitle';


/*
interface AppetizerProps{
    h1, numberMain, numberSecundary, description, moreUrl
}
 */

export default function ({h1, numberMain, numberSecundary, description, moreUrl}) {

    return React.createElement('section', { className: 'appetizer' },
        React.createElement(AppetizerTitle, {text: h1}),
        React.createElement('div', { className: 'info' },
            React.createElement('div', { className: 'number' },
                React.createElement('div', { className: 'main' }, numberMain),
                React.createElement('div', { className: 'secundary' }, numberSecundary)
            ),
            React.createElement('p', {}, description)
        ),
        React.createElement(PrimaryCallToAction, { href: moreUrl, text: 'En savoir plus'})
    );

}
