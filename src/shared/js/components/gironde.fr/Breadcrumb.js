import React from 'react';

export default function ({ items }) {
    return React.createElement('div', { className: 'breadcrumb' },
        React.createElement('nav', {},
            React.createElement('ul', {},
                items.map(({ url, text }, i) => {
                    const li = React.createElement('li', {key: i},
                        url ? React.createElement('a', { href: url }, text) : text
                    )

                    // initial breadcrumb has 3 elements. 4th and above go into a second row
                    return i === 3 ? [React.createElement('br'), li] : li;
                })
            )
        )
    )
}
