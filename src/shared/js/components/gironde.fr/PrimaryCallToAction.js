import React from 'react';

/*
    This component uses conventions from the gironde.fr website
*/

export default function({text, href}){
    return React.createElement('a', {href, className: 'btn'}, text);
}
