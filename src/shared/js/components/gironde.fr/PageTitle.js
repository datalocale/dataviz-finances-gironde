import React from 'react';

/*
    This component should be used only one per page
    It uses conventions from the gironde.fr website
*/

export default function({text}){
    return React.createElement('h1', { className: 'title--page title--bold'}, text)
}
