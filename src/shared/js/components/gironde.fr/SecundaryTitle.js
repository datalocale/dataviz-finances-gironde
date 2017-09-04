import React from 'react';

export default function({text}){
    return React.createElement('div', { className: 'article'}, 
        React.createElement('h2', {}, text)
    )
}
