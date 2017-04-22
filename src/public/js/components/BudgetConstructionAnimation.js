import React from 'react';

import { max, sum } from 'd3-array';

function delayPromise(t){
    return new Promise(resolve => setTimeout(resolve, t));
}

// unit is seconds
const BRICK_APPEAR_DURATION = 1;
const BETWEEN_BRICK_APPEAR_DURATION = 0.5;

const ENGLOBE_DURATION = 2;


function animate(container){

    console.log('animate container', container)

    const animationStart = Promise.resolve(performance.now());

    // step 1
    const step1Start = animationStart;

    const step1Done = step1Start.then(() => {
        const elementAnimationDones = [
            '.dotation-etat', '.fiscalite-directe', '.fiscalite-indirecte', '.recettes-diverses'
        ].map((s, i) => {
            const el = container.querySelector(s);
            
            el.style.animationName = `brick-appear`;
            el.style.animationDuration = `${BRICK_APPEAR_DURATION}s`;
            el.style.animationDelay = `${i*(BRICK_APPEAR_DURATION+BETWEEN_BRICK_APPEAR_DURATION)}s`;

            return new Promise(resolve => {
                el.addEventListener('animationend', resolve, {once: true})
            })
        });

        return Promise.all(elementAnimationDones)
    });

    // step 2
    const step2Start = step1Done;

    const step2Done = step2Start.then(() => {
        const rfParent = container.querySelector('.brick.rf')

        Array.from(rfParent.querySelectorAll('.brick')).forEach(el => {
            el.style.animationName = `englobed-by-parent`;
            el.style.animationDuration = `${ENGLOBE_DURATION}s`;
            el.style.animationDelay = '0s';
        });

        rfParent.style.animationName = `parent-englobes`;
        rfParent.style.animationDuration = `${ENGLOBE_DURATION}s`;
        rfParent.style.animationDelay = '0s';
    });


}

/*throw `TODO
    Take control over the component.
    Have it entirely render all the elements in their initial state.
    Then, make the animation via setting .style.animation to elements at the correct time.
    Scheduling is encoded via promises wrapping timeouts, end of animation, etc.ru
`*/


/*
interface BudgetConstructionAnimationProps{
    Dotation: 100000,
    Machins: 200000,
    Impots: 300000,
    RecettesInvestissement: 400000,
    RecettesEmprunts: 500000,
    EpargneBrute: 600000,
    DepensesFonctionnement: 700000,
    FraisFinanciers: 800000,
    Investissements: 900000
}
 */


export default class BudgetConstructionAnimation extends React.Component{

    constructor(){
        super();
        this.state = { animationStarted : false };
    }

    canStartAnimating(props){
        return !!props.DotationEtat;
    }

    animateAndLockComponent(props){
        if(this.canStartAnimating(props) && !this.state.animationStarted){
            animate(this.refs.container);
            this.setState({animationStarted: true})
        }
    }

    shouldComponentUpdate(nextProps){
        return !this.state.animationStarted && this.props.DotationEtat !== nextProps.DotationEtat
    }

    componentDidMount(){
        this.animateAndLockComponent(this.props);
    }

    componentWillReceiveProps(nextProps){
        this.animateAndLockComponent(nextProps);
    }

    render(){
        const amounts = this.props;

        const {DotationEtat, FiscalitéDirecte, FiscalitéIndirecte, RecettesDiverses} = amounts;

        const rf = sum([DotationEtat, FiscalitéDirecte, FiscalitéIndirecte, RecettesDiverses]);
        const ri = 0, di = 0, df = 0;

        const maximum = max([rf, ri, df, di]);
        const maxBrickPercentHeight = 85;


        return React.createElement('article', { className: 'budget-construction', ref: 'container' },
            DotationEtat ? React.createElement('div', {className: 'bricks'}, 
                React.createElement('div', {className: 'column'},
                    /*React.createElement('div', {className: 'total'}, 
                        React.createElement('span', {className: 'number'}, (rf/1000000000).toFixed(3) ), 
                        ' milliards'
                    ),*/
                    React.createElement(
                        'div', 
                        {
                            className: 'brick parent rf', 
                            style: {
                                height: (maxBrickPercentHeight*rf/maximum)+'%'
                            }
                        },
                        React.createElement('div', {className: 'brick dotation-etat', style: {
                            height: (100*DotationEtat/rf)+'%'
                        }}, `Dotation de l'Etat`),
                        React.createElement('div', {className: 'brick fiscalite-directe', style: {
                            height: (100*FiscalitéDirecte/rf)+'%'
                        }}, 'Fiscalité directe'),
                        React.createElement('div', {className: 'brick fiscalite-indirecte', style: {
                            height: (100*FiscalitéIndirecte/rf)+'%'
                        }}, 'Fiscalité indirecte'),
                        React.createElement('div', {className: 'brick recettes-diverses', style: {
                            height: (100*RecettesDiverses/rf)+'%'
                        }}, 'Recettes diverses'),
                        `Recettes de fonctionnement`
                    )
                ), 
                React.createElement('div', {className: 'column'}, ''
                    /*React.createElement('div', {className: 'total'}, 
                        React.createElement('span', {className: 'number'}, (ri/1000000).toFixed(0)),
                        ' millions'
                    ),
                    React.createElement('div', {className: 'brick', style: {
                        height: (maxBrickPercentHeight*ri/maximum)+'%',
                        backgroundColor: '#0E7FAB'
                    }}, 'RECETTES D’INVESTISSEMENT')*/
                ), 
                React.createElement('div', {className: 'column'}, ''
                    /*React.createElement('div', {className: 'total'}, 
                        React.createElement('span', {className: 'number'}, (df/1000000000).toFixed(3)),
                        ' milliards'
                    ),
                    React.createElement('div', {className: 'brick', style: {
                        height: (maxBrickPercentHeight*df/maximum)+'%',
                        backgroundColor: '#F8C738'
                    }}, 'DÉPENSES DE FONCTIONNEMENT')*/
                ), 
                React.createElement('div', {className: 'column'}, ''
                    /*React.createElement('div', {className: 'total'}, 
                        React.createElement('span', {className: 'number'}, (di/1000000).toFixed(0)),
                        ' millions'
                    ),
                    React.createElement('div', {className: 'brick', style: {
                        height: (maxBrickPercentHeight*di/maximum)+'%',
                        backgroundColor: '#B8C30F'
                    }}, 'DÉPENSES D’INVESTISSEMENT')*/
                )
            ) : undefined,
            React.createElement('hr'),
            React.createElement('dl', {},
                React.createElement('div', {className: 'column'},
                    React.createElement('dt', {}, 'Recettes de fonctionnement'),
                    React.createElement('dd', {}, `Ces recettes proviennent principalement du produit des impôts et taxes directes et indirectes, ainsi que des dotations versées par l'État`),
                    React.createElement('dt', {}, 'Emprunt'), 
                    React.createElement('dd', {}, `Il permet au Département d'atteindre l’équilibre budgétaire et d’investir dans des projets d’ampleur ou durables.`)
                ), 
                React.createElement('div', {className: 'column'}, 
                    React.createElement('dt', {}, 'Dépenses de fonctionnement'), 
                    React.createElement('dd', {}, `Ces dépenses financent principalement les allocations et prestations sociales ou de solidarité, les services de secours (pompiers), les transports, les collèges, les routes, ainsi que le fonctionnement propre du Département (salaires et moyens) et les intérêts d’emprunts. `)
                ), 
                React.createElement('div', {className: 'column'}, 
                    React.createElement('dt', {}, 'Recettes d’investissement'), 
                    React.createElement('dd', {}, `Elles sont principalement constituées de dotations de l’Etat et de subventions`),
                    React.createElement('dt', {}, `Dépenses d'investissement`), 
                    React.createElement('dd', {}, `Elles concernent des programmes structurants ou stratégiques pour le développement du territoire girondin : bâtiments, routes, collèges, etc.`)
                )
            )
        );
    }
}
