import React from 'react'
import {OrderedSet} from 'immutable'

function makeM52RowId(m52Row){
    return [
        m52Row['Dépense/Recette'] + m52Row['Investissement/Fonctionnement'],
        m52Row["Chapitre"],
        m52Row["Rubrique fonctionnelle"],
        m52Row["Article"]
    ].join(' ');
}

export default class TextualSelected extends React.PureComponent{

    render(){
        const {M52SelectedNode, aggregatedSelectedNode} = this.props;

        const selected = M52SelectedNode ? M52SelectedNode : aggregatedSelectedNode;
        const m52Rows = M52SelectedNode ?
            Array.from(M52SelectedNode.elements) : 
            new OrderedSet(Array.from(aggregatedSelectedNode.elements).map(e => e["M52Rows"])).flatten(1)

        return React.createElement('div', {},
            React.createElement('h1', {}, M52SelectedNode ? 'Morceau de la M52 sélectionnée' : "Morceau de l'agrégée selectionné"),
            React.createElement('h2', {}, selected.name),
            React.createElement('h3', {}, selected.total.toFixed(2) + '€'),
            React.createElement('table', {}, m52Rows.map(m52 => {
                const m52Id = makeM52RowId(m52);

                return React.createElement('tr', {key: m52Id}, 
                    React.createElement('td', {}, m52Id),
                    React.createElement('td', {}, m52["Montant"].toFixed(2)+'€')
                )
            }))
        );
    }
}