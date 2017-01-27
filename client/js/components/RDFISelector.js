import React from 'react'

/*

interface M52VizProps{
    M52Hierarchical: M52Hierarchical
}

 */

export default class RDFISelector extends React.PureComponent{
    render(){
        const { rdfi, onRDFIChange } = this.props;
        return React.createElement(
            'div',
            {
                className: 'rdfi',
                ref: (el => this.root = el),
                style: {
                    padding: "1em"
                },
                onChange: e => {
                    onRDFIChange({
                        rd: this.root.querySelector('input[type="radio"][name="rd"]:checked').value,
                        fi: this.root.querySelector('input[type="radio"][name="fi"]:checked').value
                    })
                }
            }, 
            React.createElement('span', {}, 'Répartition des'),
            React.createElement('div', {className: 'selector'},
                React.createElement('label', {}, 
                    'dépenses',
                    React.createElement('input',
                        {name: 'rd', value: "D", type: "radio", defaultChecked: rdfi['rd'] === 'D'}
                    )
                ),
                React.createElement('label', {}, 
                    'recettes',
                    React.createElement('input',
                        {name: 'rd', value: "R", type: "radio", defaultChecked: rdfi['rd'] === 'R'}
                    )
                )
            ), 
            React.createElement('div', {className: 'selector'},
                React.createElement('label', {}, 
                    'de fonctionnement',
                    React.createElement('input',
                        {name: 'fi', value: "F", type:"radio", defaultChecked: rdfi['fi'] === 'F'}
                    )
                ),
                React.createElement('label', {}, 
                    "d'investissement",
                    React.createElement('input',
                        {name: 'fi', value: "I", type:"radio", defaultChecked: rdfi['fi'] === 'I'}
                    )
                )
            )
        )
    }
}
