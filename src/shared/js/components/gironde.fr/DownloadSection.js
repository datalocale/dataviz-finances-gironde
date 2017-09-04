import React from 'react';

export default function({title, items}){
    return React.createElement('div', { className: 'w-files'}, 
        React.createElement('div', { className: 'w-files__container'}, 
            React.createElement('h3', { className: 'w-files__title'}, title),
            React.createElement('ul', { className: 'w-files__links'}, 
                items.map(({url, text}) => (
                    React.createElement('li', {}, 
                        React.createElement('a', {href: url, target: '_blank'}, text)
                    )
                ))
            )
        )
    )
}