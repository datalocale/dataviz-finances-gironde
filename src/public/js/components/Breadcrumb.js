import React from 'react';

/*
interface BreadcrumbProps{
    breadcrumb: string[], // array of content identifiers
    onContentChange: (string) => void // (side effect), displays another page
}
 */
export default function ({breadcrumb, onContentChange}) {
    const children = [];

    breadcrumb.forEach((e, i) => {
        if (i < breadcrumb.size - 1) {
            // all but last
            children.push(
                React.createElement(
                    'a',
                    {
                        href: '#',
                        onClick(e) {
                            e.preventDefault();
                            onContentChange(breadcrumb.slice(0, i + 1));
                        }
                    },
                    e
                ),
                ' / '
            );
        }
        else {
            // last
            children.push(e);
        }
    });

    return React.createElement('nav', { className: 'breadcrumb' }, children);
}
