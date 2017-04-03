import React from 'react';
import { connect } from 'react-redux';

import Placeholder from '../../../../shared/js/components/Placeholder';
import TotalAppetizer from '../TotalAppetizer';
import Appetizer from '../Appetizer';

import budgetBalance from '../../../../shared/js/finance/budgetBalance';
import { SOLIDARITES, INVEST, PRESENCE } from '../../constants/pages';


export function Home({
    expenditures,
    urls: {
        total,
        solidarities, invest, presence,
        strategy
    }
}) {

    return React.createElement('article', {className: 'home'},
        React.createElement('h1', {}, "Un budget au service d'une solidarité humaine et territoriale"),
        React.createElement('p', {}, "Ce budget est composé de dépenses de fonctionnement, nécessaires aux missions et gestion des services de la collectivité, et de dépenses d’investissement dédiées à des programmes structurants ou stratégiques pour le territoire."),
        
        React.createElement('section', {className: 'appetizers'},
            React.createElement(TotalAppetizer, {
                total: expenditures,
                year: 2016,
                totalUrl: total
            }),
            React.createElement(Appetizer, {
                h1: "Un territoire de solidarités",
                numberMain: "400 000", 
                numberSecundary: "bénéficiaires",
                description: `Le Département affirme sa vocation sociale et déploie près de 900 millions d’euros pour aider et accompagner les personnes fragilisées.
                Il emploie 1751 agents au service de l’action sociale soit près de 77 millions par an en frais de personnel pour assurer l’efficience et la proximité du service rendus aux publics les plus fragiles. A cela s’ajoute 937 assistants familiaux qui accueillent des enfants faisant l’objet de mesures de placement.`, 
                moreUrl: solidarities
            }),
            React.createElement(Appetizer, {
                h1: "Des investissements ambitieux",
                numberMain: "1 MILLIARD", 
                numberSecundary: "A l’HORIZON 2020",
                description: `Dans une période de réduction budgétaire majeure, le Département adopte une stratégie volontariste avec 200 millions d’euros investis chaque année durant la mandature.`, 
                moreUrl: invest
            }),
            React.createElement(Appetizer, {
                h1: "Une action de proximité",
                numberMain: "125 métiers", 
                numberSecundary: "277 sites",
                description: `Puéricultrice, travailleur social, agent d’exploitation et de voirie, manager, chargé de mission… Le Département déploie près de 6000 agents au plus près des Girondins, sur 277 sites de travail et d’accueil du public. Cette masse salariale constante malgré l’arrivée de 15 000 nouveaux girondins par an et la croissance des besoins de solidarité représente ????`, 
                moreUrl: presence
            })        
        ),
        
        React.createElement('section', {},
            React.createElement('h1', {}, "Comprendre la construction d'un budget"),
            React.createElement(
                'a',
                { href: strategy },
                React.createElement(Placeholder, {hint: "Comprendre la stratégie budgétaire + illustration"})
            )
        )
    );
}


export default connect(
    state => {
        const { m52Instruction } = state;
        const balance = m52Instruction ? budgetBalance(m52Instruction) : {};

        return Object.assign(
            {
                urls: {
                    total: '#!/total',
                    solidarities: '#!/focus/'+SOLIDARITES, 
                    invest: '#!/focus/'+INVEST, 
                    presence: '#!/focus/'+PRESENCE,
                    strategy: '#!/strategie'
                }
            },
            balance
        )


    },
    () => ({})
)(Home);