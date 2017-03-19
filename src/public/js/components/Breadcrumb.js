import React from 'react';

/*
interface BreadcrumbProps{
    breadcrumb: string[], // array of content identifiers
    textsById: Map<ContentId, FinanceElementTextsRecord>
    onContentChange: (string) => void // (side effect), displays another page
}
 */

export default function ({breadcrumb, textsById, onContentChange}) {
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
                    textsById.get(e).label
                ),
                ' / '
            );
        }
        else {
            // last
            children.push(textsById.get(e).label);
        }
    });

    return React.createElement('nav', { className: 'breadcrumb' }, children);
}
