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
    const {className=''} = props;

    return React.createElement('div', {
        className: className + ' markdown-rendered',
        dangerouslySetInnerHTML: {
            __html: markdown.render(props.children || '')
        }
    });
};
