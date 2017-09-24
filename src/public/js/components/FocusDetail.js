import React from 'react';

import PrimaryCallToAction from '../../../shared/js/components/gironde.fr/PrimaryCallToAction';
import Markdown from '../../../shared/js/components/Markdown';
import MoneyAmount from '../../../shared/js/components/MoneyAmount';

/*
interface FocusDetailProps{
    className:  string
    title: string,

    illustrationUrl: url,
    amount: number
    proportion: number [0, 1],
    text,
    highlights,
    moreUrl
}
 */

export default function ({className, title, illustrationUrl, amount, proportion, text, highlights = [], moreUrl}) {

    return React.createElement('div', { className: ['focus-detail', className].filter(e => e).join(' ') },
        React.createElement('div', {className: 'illustration'},
            React.createElement('img', {src: illustrationUrl})
        ),
        React.createElement('div', {className: 'explanation'},
            React.createElement('h3', {}, title),
            React.createElement('div', {className: 'proportion-container'},
                React.createElement('div', {className: 'proportion', style: {width: proportion*100+'%'}}, 
                    amount ? React.createElement(MoneyAmount, {amount}) : undefined
                )
            ),
            React.createElement(Markdown, {}, text),
            React.createElement('div', {className: 'highlights'}, 
                highlights.map(h => {
                    return React.createElement('div', {},
                        React.createElement('strong', {}, h.strong),
                        React.createElement('span', {}, h.span)
                    )
                })
            ),
            React.createElement(PrimaryCallToAction, {href: moreUrl, text: 'En savoir plus'})
        )
    );
}
