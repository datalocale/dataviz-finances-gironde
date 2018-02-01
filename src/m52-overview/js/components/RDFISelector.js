import React from 'react'

/*

interface RDFISelector{
    rdfi, 
    onRDFIChange
}

 */

export default class RDFISelector extends React.PureComponent{
    render(){
        const { rdfi, onRDFIChange } = this.props;
        return React.createElement(
            'div',
            {
                className: 'rdfi',
                style: {
                    padding: "1em"
                },
                onClick: e => {
                    const t = e.currentTarget;

                    onRDFIChange(
                        t.querySelector('input[type="radio"][name="rd"]:checked').value +
                        t.querySelector('input[type="radio"][name="fi"]:checked').value
                    )
                }
            }, 
            React.createElement('span', {}, 'Répartition des'),
            React.createElement('div', {className: 'selector'},
                React.createElement('label', {}, 
                    'dépenses',
                    React.createElement('input',
                        {name: 'rd', value: "D", type: "radio", defaultChecked: rdfi[0] === 'D'}
                    )
                ),
                React.createElement('label', {}, 
                    'recettes',
                    React.createElement('input',
                        {name: 'rd', value: "R", type: "radio", defaultChecked: rdfi[0] === 'R'}
                    )
                )
            ), 
            React.createElement('div', {className: 'selector'},
                React.createElement('label', {}, 
                    'de fonctionnement',
                    React.createElement('input',
                        {name: 'fi', value: "F", type:"radio", defaultChecked: rdfi[1] === 'F'}
                    )
                ),
                React.createElement('label', {}, 
                    "d'investissement",
                    React.createElement('input',
                        {name: 'fi', value: "I", type:"radio", defaultChecked: rdfi[1] === 'I'}
                    )
                )
            )
        )
    }
}
