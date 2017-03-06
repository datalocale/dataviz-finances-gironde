import React from 'react';
import { format } from 'currency-formatter';

export default function ({page, total}) {
    return React.createElement('article', {}, 
        React.createElement('h1', {}, page), 
        React.createElement('h2', {}, format(total, { code: 'EUR' }))
    );
}
