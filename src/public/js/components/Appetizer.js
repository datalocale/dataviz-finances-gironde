import React from 'react';

/*
interface AppetizerProps{
    h1, numberMain, numberSecundary, description, moreUrl
}
 */

export default function ({h1, numberMain, numberSecundary, description, moreUrl}) {

    return React.createElement('section', { className: 'appetizer' },
        React.createElement('h1', {}, h1),
        React.createElement('div', { className: 'info' },
            React.createElement('div', { className: 'number' },
                React.createElement('div', { className: 'main' }, numberMain),
                React.createElement('div', { className: 'secundary' }, numberSecundary)
            ),
            React.createElement('p', {}, description)
        ),
        React.createElement(
            'a', 
            { href: moreUrl },
            'En savoir plus'
        )
    );

}
