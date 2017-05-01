import React from 'react';

import { max, sum } from 'd3-array';

function delayPromise(t){
    return new Promise(resolve => setTimeout(resolve, t));
}

const SOLIDARITE = 'SOLIDARITE';
const INTERVENTIONS = 'INTERVENTIONS';
const STRUCTURE = 'STRUCTURE';

const EPARGNE = 'EPARGNE';
const RI_PROPRES = 'RI_PROPRES';
const EMPRUNT = 'EMPRUNT';

const REMBOURSEMENT_EMPRUNT = 'REMBOURSEMENT_EMPRUNT';
const ROUTES = 'ROUTES';
const COLLEGES = 'COLLEGES';
const AMENAGEMENT = 'AMENAGEMENT';
const SUBVENTIONS = 'SUBVENTIONS';

const DF_BRICK_SELECTOR = {
    [SOLIDARITE]: '.solidarite', 
    [INTERVENTIONS]: '.interventions', 
    [STRUCTURE]: '.depenses-structure'
};
const RI_BRICK_SELECTOR = {
    [RI_PROPRES]: '.ri-propres', 
    [EMPRUNT]: '.emprunt'
};

const DI_BRICK_SELECTOR = {
    [REMBOURSEMENT_EMPRUNT]: '.remboursement-emprunt',
    [ROUTES]: '.routes',
    [COLLEGES]: '.colleges', 
    [AMENAGEMENT]: '.amenagement', 
    [SUBVENTIONS]: '.subventions'
}

const MAX_PARENT_BRICK_SIZE_PROPORTION = 0.85;

// unit is seconds
const BRICK_APPEAR_DURATION = 1;
const BETWEEN_BRICK_APPEAR_DURATION = 0.5;

const ENGLOBE_DURATION = 2;

function Legend(text){
    return React.createElement('span', {className: 'legend'}, text);
}


function animate(container, {dfBrickHeights, riBrickHeights, diBrickHeights, rfHeight}){

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

        return new Promise(resolve => {
            rfParent.addEventListener('animationend', resolve, {once: true})
        })
    });

    // steps 3-5
    const step3Start = step2Done;

    const step5Done = step3Start.then(() => {
        const rfParentFilling = container.querySelector('.brick.rf .filling');
        const dfParent = container.querySelector('.brick.df');

        rfParentFilling.style.transitionDuration = `${BRICK_APPEAR_DURATION}s`;
        rfParentFilling.style.transitionDelay = `0s`;

        const rfParentFillingHeights = [STRUCTURE, INTERVENTIONS, SOLIDARITE].reduce((acc, id) => {
            const cumulative = dfBrickHeights[id] + (acc[acc.length - 1] || 0);
            acc.push(cumulative);
            return acc;
        }, []);

        return [STRUCTURE, INTERVENTIONS, SOLIDARITE].reduce((previousDone, id, i) => {
            return previousDone.then(() => {
                const el = dfParent.querySelector(DF_BRICK_SELECTOR[id]);
            
                el.style.transitionDuration = `${BRICK_APPEAR_DURATION}s`;
                el.style.height = `${dfBrickHeights[id]}em`;

                rfParentFilling.style.height = `${rfParentFillingHeights[i]}em`;

                return new Promise(resolve => {
                    el.addEventListener('transitionend', resolve, {once: true})
                })
            })
        }, Promise.resolve());

    });

    // step 6
    const step6Start = step5Done;

    const step6Done = step6Start.then(() => {
        const dfParent = container.querySelector('.brick.df')

        Array.from(dfParent.querySelectorAll('.brick')).forEach(el => {
            el.style.animationName = `englobed-by-parent`;
            el.style.animationDuration = `${ENGLOBE_DURATION}s`;
            el.style.animationDelay = '0s';
        });

        dfParent.style.animationName = `parent-englobes`;
        dfParent.style.animationDuration = `${ENGLOBE_DURATION}s`;
        dfParent.style.animationDelay = '0s';

        return new Promise(resolve => {
            dfParent.addEventListener('animationend', resolve, {once: true})
        })
    });

    // step 7
    // step 8
    const step8Start = step6Done;

    const step8Done = step8Start.then(() => {
        const rfParent = container.querySelector('.brick.rf');
        const epargneElement = container.querySelector('.brick.ri .epargne');
        const epargneHeight = riBrickHeights[EPARGNE];

        rfParent.style.transitionDuration = `${BRICK_APPEAR_DURATION}s`;
        rfParent.style.height = `${rfHeight - epargneHeight}em`;

        epargneElement.style.transitionDuration = `${BRICK_APPEAR_DURATION}s`;
        epargneElement.style.height = `${epargneHeight}em`;
        
        return new Promise(resolve => {
            epargneElement.addEventListener('transitionend', resolve, {once: true})
        })
    })

    // step 9
    const step9Start = step8Done;

    const step9Done = step9Start.then(() => {
        const riParent = container.querySelector('.brick.ri')

        return [RI_PROPRES, EMPRUNT].reduce((previousDone, id) => {
            return previousDone.then(() => {
                const el = riParent.querySelector(RI_BRICK_SELECTOR[id]);

                el.style.transitionDuration = `${BRICK_APPEAR_DURATION}s`;
                el.style.height = `${riBrickHeights[id]}em`;

                return new Promise(resolve => {
                    el.addEventListener('transitionend', resolve, {once: true})
                })
            })
        }, Promise.resolve());
    })

    // step 10
    const step10Start = step9Done;

    const step10Done = step10Start.then(() => {
        const riParent = container.querySelector('.brick.ri')

        Array.from(riParent.querySelectorAll('.brick')).forEach(el => {
            el.style.animationName = `englobed-by-parent`;
            el.style.animationDuration = `${ENGLOBE_DURATION}s`;
            el.style.animationDelay = '0s';
        });

        riParent.style.animationName = `parent-englobes`;
        riParent.style.animationDuration = `${ENGLOBE_DURATION}s`;
        riParent.style.animationDelay = '0s';

        return new Promise(resolve => {
            riParent.addEventListener('animationend', resolve, {once: true})
        })
    });

    // steps 11-12
    const step11Start = step10Done;

    const step12Done = step11Start.then(() => {
        const diParent = container.querySelector('.brick.di')

        return [REMBOURSEMENT_EMPRUNT, ROUTES, COLLEGES, AMENAGEMENT, SUBVENTIONS].reduce((previousDone, id) => {
            return previousDone.then(() => {
                const el = diParent.querySelector(DI_BRICK_SELECTOR[id]);

                el.style.transitionDuration = `${BRICK_APPEAR_DURATION}s`;
                el.style.height = `${diBrickHeights[id]}em`;

                return new Promise(resolve => {
                    el.addEventListener('transitionend', resolve, {once: true})
                })
            })
        }, Promise.resolve());
    });

    // step 13
    const step13Start = step12Done;

    const step13Done = step13Start.then(() => {
        const diParent = container.querySelector('.brick.di')

        Array.from(diParent.querySelectorAll('.brick')).forEach(el => {
            el.style.animationName = `englobed-by-parent`;
            el.style.animationDuration = `${ENGLOBE_DURATION}s`;
            el.style.animationDelay = '0s';
        });

        diParent.style.animationName = `parent-englobes`;
        diParent.style.animationDuration = `${ENGLOBE_DURATION}s`;
        diParent.style.animationDelay = '0s';

        return new Promise(resolve => {
            diParent.addEventListener('animationend', resolve, {once: true})
        })
    });

    const endOfAnimation = step13Done;

    return endOfAnimation.catch(e => console.error('animation error', e))

}

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

function doTheMaths({
        DotationEtat, FiscalitéDirecte, FiscalitéIndirecte, RecettesDiverses,
        Solidarité, Interventions, DépensesStructure,
        RIPropre, Emprunt,
        RemboursementEmprunt, Routes, Colleges, Amenagement, Subventions
    }, bricksContainerSize){

    const rf = sum([DotationEtat, FiscalitéDirecte, FiscalitéIndirecte, RecettesDiverses]);
    const df = sum([Solidarité, Interventions, DépensesStructure]);

    const epargne = rf - df;

    const ri = epargne + RIPropre + Emprunt;
    const di = RemboursementEmprunt + Routes + Colleges + Amenagement + Subventions;

    const maxAmount = max([rf, ri, df, di]);

    const maxHeight = MAX_PARENT_BRICK_SIZE_PROPORTION*bricksContainerSize;
    const rfHeight = maxHeight*rf/maxAmount;
    const dfHeight = maxHeight*df/maxAmount;
    const riHeight = maxHeight*ri/maxAmount;
    const diHeight = maxHeight*di/maxAmount;

    return {
        rf, ri, df, di, 
        maxAmount,
        dfBrickHeights: {
            [SOLIDARITE]: dfHeight*Solidarité/df,
            [INTERVENTIONS]: dfHeight*Interventions/df,
            [STRUCTURE]: dfHeight*DépensesStructure/df,
        },
        riBrickHeights: {
            [EPARGNE]: riHeight*epargne/ri,
            [RI_PROPRES]: riHeight*RIPropre/ri, 
            [EMPRUNT]: riHeight*Emprunt/ri
        },
        diBrickHeights: {
            [REMBOURSEMENT_EMPRUNT]: diHeight*RemboursementEmprunt/di,
            [ROUTES]: diHeight*Routes/di,
            [COLLEGES]: diHeight*Colleges/di,
            [AMENAGEMENT]: diHeight*Amenagement/di,
            [SUBVENTIONS]: diHeight*Subventions/di
        },
        rfHeight
    }
}


export default class BudgetConstructionAnimation extends React.Component{

    constructor(){
        super();
        this.state = { 
            animationStarted : false,
            computationCache: undefined,
            bricksContainerSize: undefined // em
        };
    }

    financeDataReady(props){
        return !!props.DotationEtat;
    }

    animateAndLockComponent(props){
        if(this.financeDataReady(props) && !this.state.animationStarted && this.state.computationCache){
            const {dfBrickHeights, riBrickHeights, diBrickHeights, rfHeight} = this.state.computationCache;

            animate(this.refs.container, {dfBrickHeights, riBrickHeights, diBrickHeights, rfHeight});
            this.setState(Object.assign({}, this.state, {animationStarted: true}))
        }
    }

    shouldComponentUpdate(nextProps){
        return !this.state.animationStarted && this.props.DotationEtat !== nextProps.DotationEtat
    }

    componentDidMount(){
        this.animateAndLockComponent(this.props);

        const bricksContainer = this.refs.container.querySelector('.bricks');
        // these sizes are in px
        const {fontSize, height} = getComputedStyle(bricksContainer);

        this.setState(Object.assign(
            {}, 
            this.state,
            {bricksContainerSize: parseFloat(height)/parseFloat(fontSize)}
        ))
    }

    componentWillReceiveProps(nextProps){
        if(this.financeDataReady(nextProps) && !this.state.animationStarted){
            this.setState(Object.assign({}, this.state, {computationCache: doTheMaths(nextProps, this.state.bricksContainerSize)}))
        }
        
        this.animateAndLockComponent(nextProps);
    }

    render(){
        const amounts = this.props;
        const {bricksContainerSize} = this.state;

        const {
            DotationEtat, FiscalitéDirecte, FiscalitéIndirecte, RecettesDiverses, 
            Solidarité, Interventions, DépensesStructure,
            RIPropre, Emprunt,
            RemboursementEmprunt, Routes, Colleges, Amenagement, Subventions
        } = amounts;

        const rf = DotationEtat + FiscalitéDirecte + FiscalitéIndirecte + RecettesDiverses
        const df = Solidarité + Interventions + DépensesStructure
        const epargne = rf - df;
        const ri = epargne + RIPropre + Emprunt;
        const di = RemboursementEmprunt + Routes + Colleges + Amenagement + Subventions;

        const maxAmount = max([rf, ri, df, di]);

        const maxHeight = MAX_PARENT_BRICK_SIZE_PROPORTION*bricksContainerSize;
        const rfHeight = maxHeight*rf/maxAmount;
        const dfHeight = maxHeight*df/maxAmount;

        const riHeight = maxHeight*ri/maxAmount;
        const diHeight = maxHeight*di/maxAmount;

        console.log('bricksContainerSize', bricksContainerSize, maxHeight);
        

        return React.createElement('article', { className: 'budget-construction', ref: 'container' },
            React.createElement('div', {className: 'bricks'}, 
                DotationEtat ? [ 
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
                                    height: `${rfHeight}em`
                                }
                            },
                            React.createElement('div', {className: 'brick appear-by-opacity dotation-etat', style: {
                                height: (rfHeight*DotationEtat/rf)+'em'
                            }}, Legend(`Dotation de l'Etat`)),
                            React.createElement('div', {className: 'brick appear-by-opacity fiscalite-directe', style: {
                                height: (rfHeight*FiscalitéDirecte/rf)+'em'
                            }}, Legend('Fiscalité directe')),
                            React.createElement('div', {className: 'brick appear-by-opacity fiscalite-indirecte', style: {
                                height: (rfHeight*FiscalitéIndirecte/rf)+'em'
                            }}, Legend('Fiscalité indirecte')),
                            React.createElement('div', {className: 'brick appear-by-opacity recettes-diverses', style: {
                                height: (rfHeight*RecettesDiverses/rf)+'em'
                            }}, Legend('Recettes diverses')),
                            // RF filling matches DF growth
                            React.createElement('div', {className: 'filling-container', style: {
                                height: `${dfHeight}em`
                            }}, React.createElement('div', {className: 'filling'})),
                            Legend(`Recettes de fonctionnement`)
                        )
                    ), 
                    React.createElement('div', {className: 'column'}, 
                        /*React.createElement('div', {className: 'total'}, 
                            React.createElement('span', {className: 'number'}, (ri/1000000).toFixed(0)),
                            ' millions'
                        ),*/
                        React.createElement(
                            'div', 
                            {
                                className: 'brick parent ri', 
                                style: {
                                    height: `${riHeight}em`
                                }
                            },
                            React.createElement('div', {className: 'brick appear-by-height epargne'}, Legend(`Epargne`)),
                            React.createElement('div', {className: 'brick appear-by-height ri-propres'}, Legend('RI propres')),
                            React.createElement('div', {className: 'brick appear-by-height emprunt'}, Legend('Emprunt')),
                            Legend(`Recettes d'investissement`)
                        )
                    ), 
                    React.createElement('div', {className: 'column'},
                        /*React.createElement('div', {className: 'total'}, 
                            React.createElement('span', {className: 'number'}, (rf/1000000000).toFixed(3) ), 
                            ' milliards'
                        ),*/
                        React.createElement(
                            'div', 
                            {
                                className: 'brick parent df', 
                                style: {
                                    height: `${dfHeight}em`
                                }
                            },
                            React.createElement('div', {className: 'brick appear-by-height solidarite'}, Legend(`Solidarité`)),
                            React.createElement('div', {className: 'brick appear-by-height interventions'}, Legend('Interventions')),
                            React.createElement('div', {className: 'brick appear-by-height depenses-structure'}, Legend('Dépenses de structure')),
                            Legend(`Dépenses de fonctionnement`)
                        )
                    ), 
                    React.createElement('div', {className: 'column'}, 
                        /*React.createElement('div', {className: 'total'}, 
                            React.createElement('span', {className: 'number'}, (di/1000000).toFixed(0)),
                            ' millions'
                        ),*/
                        React.createElement(
                            'div', 
                            {
                                className: 'brick parent di', 
                                style: {
                                    height: `${diHeight}em`
                                }
                            },
                            React.createElement('div', {className: 'brick appear-by-height remboursement-emprunt'}, Legend(`Remboursement emprunt`)),
                            React.createElement('div', {className: 'brick appear-by-height routes'}, Legend('Routes')),
                            React.createElement('div', {className: 'brick appear-by-height colleges'}, Legend('Collèges')),
                            React.createElement('div', {className: 'brick appear-by-height amenagement'}, Legend('Aménagement')),
                            React.createElement('div', {className: 'brick appear-by-height subventions'}, Legend('Subventions')),
                            Legend(`Dépenses d'investissement`)
                        )
                    )
                ] : undefined
            ),
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
