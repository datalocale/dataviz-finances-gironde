import React from 'react';
import md from 'markdown-it';

export const markdown = md({
    html: true,
    xhtmlOut: false,
    breaks: false,
    langPrefix: 'language-',
    linkify: true,
    typographer: false,
    quotes: '“”‘’',
});

export default (props) => {
    const {className='', children=''} = props;

    // If the text is indented in the source code, this removes the indentation
    const text = String(children).replace(/\n[\x20\t]*/g, '\n');

    return React.createElement('div', {
        className: [className, 'markdown-rendered'].filter(e => e).join(''),
        dangerouslySetInnerHTML: {
            __html: markdown.render(text)
        }
    });
};
