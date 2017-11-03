import React from 'react';

/*
    This component uses conventions from the gironde.fr website
*/

export default function({text = 'En savoir plus', href, className, children}){
    return React.createElement('a', {href, className: ['btn', className].filter(e => e).join(' ')}, children || text);
}
