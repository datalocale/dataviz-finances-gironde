import React from 'react';

import { max, sum } from 'd3-array';

const DOTATION = 'DOTATION';
const FISCALITE_DIRECTE = 'FISCALITE_DIRECTE';
const FISCALITE_INDIRECTE = 'FISCALITE_INDIRECTE';
const RECETTES_DIVERSES = 'RECETTES_DIVERSES';

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

const RF_BRICK_SELECTOR = {
    [DOTATION]: '.dotation-etat',
    [FISCALITE_DIRECTE]: '.fiscalite-directe',
    [FISCALITE_INDIRECTE]: '.fiscalite-indirecte',
    [RECETTES_DIVERSES]: '.recettes-diverses'
};
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
};

const MAX_PARENT_BRICK_SIZE_PROPORTION = 0.85;

// unit is seconds
const BRICK_APPEAR_DURATION = 0.5; 

function Legend(text) {
    return React.createElement('span', { className: 'legend' }, text);
}


function animate(container, {dfBrickHeights, riBrickHeights, diBrickHeights, rfBrickHeights}) {

    let rfParent, rfBricks, dfParent, dfBricks, riParent, epargneElement, riBricks, diParent, diBricks;

    const animationStart = Promise.resolve()
        .then(() => {
            // RF
            rfParent = container.querySelector('.brick.rf');
            rfBricks = [DOTATION, FISCALITE_DIRECTE, FISCALITE_INDIRECTE, RECETTES_DIVERSES]
                .map(id => rfParent.querySelector(RF_BRICK_SELECTOR[id]));

            // DF
            dfParent = container.querySelector('.brick.df');
            dfBricks = [STRUCTURE, INTERVENTIONS, SOLIDARITE].map(id => dfParent.querySelector(DF_BRICK_SELECTOR[id]));

            // RI
            riParent = container.querySelector('.brick.ri');
            epargneElement = riParent.querySelector('.epargne');
            riBricks = [RI_PROPRES, EMPRUNT].map(id => riParent.querySelector(RI_BRICK_SELECTOR[id])).concat([epargneElement]);

            // DI
            diParent = container.querySelector('.brick.di');
            diBricks = [REMBOURSEMENT_EMPRUNT, ROUTES, COLLEGES, AMENAGEMENT, SUBVENTIONS]
                .map(id => diParent.querySelector(DI_BRICK_SELECTOR[id]));
        })

    // Bring in RF bricks
    const rfBricksStart = animationStart;

    const rfBricksDone = rfBricksStart.then(() => {
        return [DOTATION, FISCALITE_DIRECTE, FISCALITE_INDIRECTE, RECETTES_DIVERSES].reduce((previousDone, id) => {
            return previousDone.then(() => {
                const el = rfParent.querySelector(RF_BRICK_SELECTOR[id]);

                el.style.transitionDuration = `${BRICK_APPEAR_DURATION}s`;
                // using rAF otherwise the transition doesn't occur for the first element 
                // (and transitionend event doesn't happen and other elementd don't appear)
                requestAnimationFrame( () => {el.style.height = `${rfBrickHeights[id]}em`})

                return new Promise(resolve => {
                    el.addEventListener('transitionend', resolve, { once: true });
                }).catch(err => console.error('rf err', err))
            })
        }, Promise.resolve());
    });

    // DF bricks
    const dfBricksStart = rfBricksDone;

    const dfBricksDone = dfBricksStart.then(() => {
        return [STRUCTURE, INTERVENTIONS, SOLIDARITE].reduce((previousDone, id) => {
            return previousDone.then(() => {
                const el = dfParent.querySelector(DF_BRICK_SELECTOR[id]);

                el.style.transitionDuration = `${BRICK_APPEAR_DURATION}s`;
                el.style.height = `${dfBrickHeights[id]}em`;

                return new Promise(resolve => {
                    el.addEventListener('transitionend', resolve, { once: true });
                })
            })
        }, Promise.resolve());

    });


    // Epargne brick
    const epargneBrickStart = dfBricksDone;

    const epargneBrickDone = epargneBrickStart.then(() => {
        const epargneHeight = riBrickHeights[EPARGNE];

        rfParent.style.transitionDuration = `${BRICK_APPEAR_DURATION}s`;

        epargneElement.style.transitionDuration = `${BRICK_APPEAR_DURATION}s`;
        epargneElement.style.height = `${epargneHeight}em`;

        return new Promise(resolve => {
            epargneElement.addEventListener('transitionend', resolve, { once: true })
        })
    })

    // other RU bricks
    const otherRiBricksStart = epargneBrickDone;

    const otherRiBricksDone = otherRiBricksStart.then(() => {
        return [RI_PROPRES, EMPRUNT].reduce((previousDone, id) => {
            return previousDone.then(() => {
                const el = riParent.querySelector(RI_BRICK_SELECTOR[id]);

                el.style.transitionDuration = `${BRICK_APPEAR_DURATION}s`;
                el.style.height = `${riBrickHeights[id]}em`;

                return new Promise(resolve => {
                    el.addEventListener('transitionend', resolve, { once: true })
                })
            })
        }, Promise.resolve());
    });

    // DI bricks
    const diBricksStart = otherRiBricksDone;

    const diBricksDone = diBricksStart.then(() => {
        const diParent = container.querySelector('.brick.di')

        return [REMBOURSEMENT_EMPRUNT, ROUTES, COLLEGES, AMENAGEMENT, SUBVENTIONS].reduce((previousDone, id) => {
            return previousDone.then(() => {
                const el = diParent.querySelector(DI_BRICK_SELECTOR[id]);

                el.style.transitionDuration = `${BRICK_APPEAR_DURATION}s`;
                el.style.height = `${diBrickHeights[id]}em`;

                return new Promise(resolve => {
                    el.addEventListener('transitionend', resolve, { once: true })
                })
            })
        }, Promise.resolve());
    });

    // Replay button
    const addReplayButton = diBricksDone.then(() => {
        const replayButton = document.querySelector('.replay');

        replayButton.style.transitionDuration = `${BRICK_APPEAR_DURATION}s`;
        replayButton.style.opacity = `1`;

        // reset styles
        replayButton.addEventListener('click', () => {
            rfBricks.forEach(el => { el.style.height = 0; })
            dfBricks.forEach(el => { el.style.height = 0; })
            riBricks.forEach(el => { el.style.height = 0; })
            diBricks.forEach(el => { el.style.height = 0; })

            // replay
            animate(container, { dfBrickHeights, riBrickHeights, diBrickHeights, rfBrickHeights })
        })

    });

    const endOfAnimation = addReplayButton;

    return endOfAnimation.catch(e => console.error('animation error', e))

}


function doTheMaths({
    DotationEtat, FiscalitéDirecte, FiscalitéIndirecte, RecettesDiverses,
    Solidarité, Interventions, DépensesStructure,
    RIPropre, Emprunt,
    RemboursementEmprunt, Routes, Colleges, Amenagement, Subventions
}, bricksContainerSize) {

    const rf = sum([DotationEtat, FiscalitéDirecte, FiscalitéIndirecte, RecettesDiverses]);
    const df = sum([Solidarité, Interventions, DépensesStructure]);

    const epargne = rf - df;

    const ri = epargne + RIPropre + Emprunt;
    const di = RemboursementEmprunt + Routes + Colleges + Amenagement + Subventions;

    const maxAmount = max([rf, ri, df, di]);

    const maxHeight = MAX_PARENT_BRICK_SIZE_PROPORTION * bricksContainerSize;
    const rfHeight = maxHeight * rf / maxAmount;
    const dfHeight = maxHeight * df / maxAmount;
    const riHeight = maxHeight * ri / maxAmount;
    const diHeight = maxHeight * di / maxAmount;

    return {
        rf, ri, df, di,
        maxAmount,
        rfBrickHeights: {
            [DOTATION]: rfHeight * DotationEtat / rf,
            [FISCALITE_DIRECTE]: rfHeight * FiscalitéDirecte / rf,
            [FISCALITE_INDIRECTE]: rfHeight * FiscalitéIndirecte / rf,
            [RECETTES_DIVERSES]: rfHeight * RecettesDiverses / rf,
        },
        dfBrickHeights: {
            [SOLIDARITE]: dfHeight * Solidarité / df,
            [INTERVENTIONS]: dfHeight * Interventions / df,
            [STRUCTURE]: dfHeight * DépensesStructure / df,
        },
        riBrickHeights: {
            [EPARGNE]: riHeight * epargne / ri,
            [RI_PROPRES]: riHeight * RIPropre / ri,
            [EMPRUNT]: riHeight * Emprunt / ri
        },
        diBrickHeights: {
            [REMBOURSEMENT_EMPRUNT]: diHeight * RemboursementEmprunt / di,
            [ROUTES]: diHeight * Routes / di,
            [COLLEGES]: diHeight * Colleges / di,
            [AMENAGEMENT]: diHeight * Amenagement / di,
            [SUBVENTIONS]: diHeight * Subventions / di
        }
    }
}


export default class BudgetConstructionAnimation extends React.Component {

    constructor() {
        super();
        this.state = {
            bricksContainerSize: undefined // em
        };
    }

    financeDataReady(props) {
        return !!props.DotationEtat;
    }

    animateAndLockComponent(props, bricksContainerSize) {
        if (this.financeDataReady(props) && bricksContainerSize) {
            const {dfBrickHeights, riBrickHeights, diBrickHeights, rfBrickHeights} = doTheMaths(props, bricksContainerSize);

            animate(this.refs.container, { dfBrickHeights, riBrickHeights, diBrickHeights, rfBrickHeights });
            setTimeout(() => this.setState(Object.assign({}, this.state)))
        }
    }

    componentDidMount() {
        const bricksContainer = this.refs.container.querySelector('.bricks');
        // these sizes are in px
        const {fontSize, height} = getComputedStyle(bricksContainer);

        this.setState(Object.assign(
            {},
            this.state,
            {
                bricksContainerSize: parseFloat(height) / parseFloat(fontSize)
            }
        ));

        // so the state is actually up to date when calling animateAndLockComponent
        setTimeout(() => {
            this.animateAndLockComponent(this.props, this.state.bricksContainerSize)
        });
    }

    componentWillUnmount() {
        this.setState({
            bricksContainerSize: undefined // em
        })
    }

    componentWillReceiveProps(nextProps) {
        this.animateAndLockComponent(nextProps, this.state.bricksContainerSize);
    }

    render() {
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

        const maxHeight = MAX_PARENT_BRICK_SIZE_PROPORTION * bricksContainerSize;
        const rfHeight = maxHeight * rf / maxAmount;
        const dfHeight = maxHeight * df / maxAmount;

        const riHeight = maxHeight * ri / maxAmount;
        const diHeight = maxHeight * di / maxAmount;

        return React.createElement('article', { className: 'budget-construction', ref: 'container' },
            React.createElement('div', { className: 'bricks' },
                DotationEtat ? [
                    React.createElement('div', { className: 'column' },
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
                            React.createElement('div', { className: 'brick appear-by-height dotation-etat'}, Legend(`Dotation de l'Etat`)),
                            React.createElement('div', { className: 'brick appear-by-height fiscalite-directe' }, Legend('Fiscalité directe')),
                            React.createElement('div', { className: 'brick appear-by-height fiscalite-indirecte'}, Legend('Fiscalité indirecte')),
                            React.createElement('div', { className: 'brick appear-by-height recettes-diverses' }, Legend('Recettes diverses')),
                            Legend(`Recettes de fonctionnement`)
                        )
                    ),
                    React.createElement('div', { className: 'column' },
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
                            React.createElement('div', { className: 'brick appear-by-height epargne' }, Legend(`Epargne`)),
                            React.createElement('div', { className: 'brick appear-by-height ri-propres' }, Legend('RI propres')),
                            React.createElement('div', { className: 'brick appear-by-height emprunt' }, Legend('Emprunt')),
                            Legend(`Recettes d'investissement`)
                        )
                    ),
                    React.createElement('div', { className: 'column' },
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
                            React.createElement('div', { className: 'brick appear-by-height solidarite' }, Legend(`Solidarité`)),
                            React.createElement('div', { className: 'brick appear-by-height interventions' }, Legend('Interventions')),
                            React.createElement('div', { className: 'brick appear-by-height depenses-structure' }, Legend('Dépenses de structure')),
                            Legend(`Dépenses de fonctionnement`)
                        )
                    ),
                    React.createElement('div', { className: 'column' },
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
                            React.createElement('div', { className: 'brick appear-by-height remboursement-emprunt' }, Legend(`Remboursement emprunt`)),
                            React.createElement('div', { className: 'brick appear-by-height routes' }, Legend('Routes')),
                            React.createElement('div', { className: 'brick appear-by-height colleges' }, Legend('Collèges')),
                            React.createElement('div', { className: 'brick appear-by-height amenagement' }, Legend('Aménagement')),
                            React.createElement('div', { className: 'brick appear-by-height subventions' }, Legend('Subventions')),
                            Legend(`Dépenses d'investissement`)
                        )
                    )
                ] : undefined
            ),
            React.createElement('hr'),
            React.createElement('dl', {},
                React.createElement('div', { className: 'column' },
                    React.createElement('dt', {}, 'Recettes de fonctionnement'),
                    React.createElement('dd', {}, `Ces recettes proviennent principalement du produit des impôts et taxes directes et indirectes, ainsi que des dotations versées par l'État`),
                    React.createElement('dt', {}, 'Emprunt'),
                    React.createElement('dd', {}, `Il permet au Département d'atteindre l’équilibre budgétaire et d’investir dans des projets d’ampleur ou durables.`)
                ),
                React.createElement('div', { className: 'column' },
                    React.createElement('dt', {}, 'Dépenses de fonctionnement'),
                    React.createElement('dd', {}, `Ces dépenses financent principalement les allocations et prestations sociales ou de solidarité, les services de secours (pompiers), les transports, les collèges, les routes, ainsi que le fonctionnement propre du Département (salaires et moyens) et les intérêts d’emprunts. `)
                ),
                React.createElement('div', { className: 'column' },
                    React.createElement('dt', {}, 'Recettes d’investissement'),
                    React.createElement('dd', {}, `Elles sont principalement constituées de dotations de l’Etat et de subventions`),
                    React.createElement('dt', {}, `Dépenses d'investissement`),
                    React.createElement('dd', {}, `Elles concernent des programmes structurants ou stratégiques pour le développement du territoire girondin : bâtiments, routes, collèges, etc.`)
                )
            ),
            React.createElement('button', { className: 'replay' }, 'rejouer')
        );
    }
}
