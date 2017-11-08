import React from 'react';

import { max, sum } from 'd3-array';
import { scaleLinear } from 'd3-scale';

import PrimaryCallToAction from '../../../shared/js/components/gironde.fr/PrimaryCallToAction';
import MoneyAmount from '../../../shared/js/components/MoneyAmount';

function delay(time){
    return () => new Promise(resolve => setTimeout(resolve, time))
}

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

const REMBOURSEMENT_DETTE = 'REMBOURSEMENT_DETTE';
const INFRASTRUCTURE = 'INFRASTRUCTURE';
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
    [REMBOURSEMENT_DETTE]: '.remboursement-emprunt',
    [INFRASTRUCTURE]: '.infra',
    [SUBVENTIONS]: '.subventions'
};

const MAX_PARENT_BRICK_SIZE_PROPORTION = 0.80;
const MIN_BRICK_HEIGHT = 4; // em
const IN_BETWEEN_BRICK_SPACE = 0.5; // em // to be sync with variable of same name in budget-construction.scss

const SECOND = 1000; // in milliseconds

// unit in seconds
const BRICK_APPEAR_DURATION = 0.2; 
const BETWEEN_BRICK_PAUSE_DURATION = 0.2; 
const BETWEEN_COLUMN_PAUSE_DURATION = 1; 
const READING_TIME = 5;



function Legend(text, amount) {
    return React.createElement('div', { className: 'legend' },
        React.createElement('span', { className: 'text' }, text),
        React.createElement(MoneyAmount, { amount })
    )
}

function displayPlayButton(b, time){
    b.style.transitionDuration = `${time}s`;
    b.style.opacity = `1`;
    b.removeAttribute('disabled');

    return delay(time*SECOND)();
}


function hidePlayButton(b){
    b.style.transitionDuration = `${BRICK_APPEAR_DURATION}s`;
    b.style.opacity = `0`;
    b.setAttribute('disabled', '');

    return delay(100)();
}


function animate(container, {dfBrickHeights, riBrickHeights, diBrickHeights, rfBrickHeights}) {

    let rfParent, rfBricks, rfEmptier, rfDefs,
        dfParent, dfBricks, dfDefs,
        riParent, epargneElement, riBricks, riEmptier, riDefs,
        diParent, diBricks, diDefs, 
        textArea, playButton;

    const animationStart = Promise.resolve()
    .then(() => {
        // RF
        rfParent = container.querySelector('.brick.rf');
        rfBricks = [DOTATION, FISCALITE_DIRECTE, FISCALITE_INDIRECTE, RECETTES_DIVERSES]
            .map(id => rfParent.querySelector(RF_BRICK_SELECTOR[id]));
        rfEmptier = rfParent.querySelector('.emptier');
        rfDefs = container.querySelector('dl .rf');

        // DF
        dfParent = container.querySelector('.brick.df');
        dfBricks = [STRUCTURE, INTERVENTIONS, SOLIDARITE].map(id => dfParent.querySelector(DF_BRICK_SELECTOR[id]));
        dfDefs = container.querySelector('dl .df');

        // RI
        riParent = container.querySelector('.brick.ri');
        epargneElement = riParent.querySelector('.epargne');
        riBricks = [RI_PROPRES, EMPRUNT].map(id => riParent.querySelector(RI_BRICK_SELECTOR[id])).concat([epargneElement]);
        riEmptier = riParent.querySelector('.emptier');
        riDefs = container.querySelector('dl .ri');

        // DI
        diParent = container.querySelector('.brick.di');
        diBricks = [REMBOURSEMENT_DETTE, INFRASTRUCTURE, SUBVENTIONS]
            .map(id => diParent.querySelector(DI_BRICK_SELECTOR[id]));
        diDefs = container.querySelector('dl .di');

        // play button
        playButton = container.querySelector('.play');
        
        // reset styles
        playButton.addEventListener('click', () => {
            rfBricks.forEach(el => { el.style.height = 0; })
            dfBricks.forEach(el => { el.style.height = 0; })
            riBricks.forEach(el => { el.style.height = 0; })
            diBricks.forEach(el => { el.style.height = 0; })

            rfEmptier.style.height = 0;
            riEmptier.style.height = 0;
            
            hidePlayButton(playButton)
            .then(() => startAnimation({READING_TIME, BRICK_APPEAR_DURATION, BETWEEN_BRICK_PAUSE_DURATION, BETWEEN_COLUMN_PAUSE_DURATION}))
        })

        // text area
        textArea = container.querySelector('.text-area');

        // initial run to get show final state initially
        startAnimation({
            READING_TIME: 0, 
            BRICK_APPEAR_DURATION: 0.02, 
            BETWEEN_BRICK_PAUSE_DURATION: 0, 
            BETWEEN_COLUMN_PAUSE_DURATION: 0
        })

    })


    function startAnimation({READING_TIME, BRICK_APPEAR_DURATION, BETWEEN_BRICK_PAUSE_DURATION, BETWEEN_COLUMN_PAUSE_DURATION}){
        const rfBricksStart = animationStart;
        textArea.textContent = `Pour construire son budget le Département dispose de plusieurs sources de revenus ou recettes de fonctionnement. Ces recettes proviennent principalement du produit des impôts et taxes directes et indirectes, ainsi que des dotations versées par l’Etat.`
        let reading = animationStart.then( delay(READING_TIME*SECOND) );
    
        const rfBricksDone = rfBricksStart.then(() => {
            rfDefs.style.opacity = 1;
    
            return [DOTATION, FISCALITE_DIRECTE, FISCALITE_INDIRECTE, RECETTES_DIVERSES].reduce((previousDone, id) => {
                return previousDone.then(() => {
                    const el = rfParent.querySelector(RF_BRICK_SELECTOR[id]);
    
                    el.style.transitionDuration = `${BRICK_APPEAR_DURATION}s`;
                    // using setTimeout otherwise the transition doesn't occur for the first element 
                    // (and transitionend event doesn't happen and other elementd don't appear)
                    setTimeout( () => {el.style.height = `${rfBrickHeights[id]}em`}, 100)
    
                    return new Promise(resolve => {
                        el.addEventListener('transitionend', resolve, { once: true });
                    })
                    .then(delay(BETWEEN_BRICK_PAUSE_DURATION*SECOND))
                })
            }, Promise.resolve());
        });
    
        // DF bricks
        const dfBricksStart = Promise.all([
            rfBricksDone.then(delay(BETWEEN_COLUMN_PAUSE_DURATION*SECOND)),
            reading
        ]);
        reading = dfBricksStart
        .then(() => {
            textArea.textContent = `Ces recettes financent les allocations et prestations sociales ou de solidarité gérées
            par le Département, les services de secours (pompiers), les transports, les collèges, l’entretien des routes, les intérêts d’emprunts et permettent le fonctionnement de l’administration départementale (personnel, entretien bâtiments, charges courantes…)`
        })
        .then( delay(READING_TIME*SECOND) );
    
        const dfBricksDone = dfBricksStart.then(() => {
            rfEmptier.style.transitionDuration = `${BRICK_APPEAR_DURATION}s`;
            let rfEmptierHeight = 0;
    
            dfDefs.style.opacity = 1;
    
            return [STRUCTURE, INTERVENTIONS, SOLIDARITE].reduce((previousDone, id, i, arr) => {
                return previousDone.then(() => {
                    const el = dfParent.querySelector(DF_BRICK_SELECTOR[id]);
    
                    el.style.transitionDuration = `${BRICK_APPEAR_DURATION}s`;
                    el.style.height = `${dfBrickHeights[id]}em`;
    
                    rfEmptierHeight += dfBrickHeights[id];
                    if(i >= 1){
                        rfEmptierHeight += IN_BETWEEN_BRICK_SPACE;
                    }
                    if(i === arr.length - 1){ // last
                        rfEmptier.style.height = `calc(100% - ${riBrickHeights[EPARGNE]}em)`;
                    }
                    else{
                        rfEmptier.style.height = `${rfEmptierHeight}em`
                    }
    
                    
                    return new Promise(resolve => {
                        el.addEventListener('transitionend', resolve, { once: true });
                    })
                    .then(delay(BETWEEN_BRICK_PAUSE_DURATION*SECOND))
                })
            }, Promise.resolve());
    
        });
    
    
        // Epargne brick
        const epargneBrickStart = Promise.all([
            dfBricksDone.then(delay(BETWEEN_COLUMN_PAUSE_DURATION*SECOND)),
            reading
        ]);
        
        reading = epargneBrickStart
        .then(() => {
            textArea.textContent = `La maitrise de ces dépenses de fonctionnement permet au Département de constituer une épargne`
        })
        .then( delay(READING_TIME*SECOND) );


        const epargneBrickDone = epargneBrickStart.then(() => {
            riDefs.style.opacity = 1;
    
            const epargneHeight = riBrickHeights[EPARGNE];
    
            epargneElement.style.transitionDuration = `${BRICK_APPEAR_DURATION}s`;
            epargneElement.style.height = `${epargneHeight}em`;
    
            rfEmptier.style.height = `100%`;
    
            return new Promise(resolve => {
                epargneElement.addEventListener('transitionend', resolve, { once: true })
            })
        })
    
        // other RU bricks
        const otherRiBricksStart = Promise.all([
            epargneBrickDone.then(delay(BETWEEN_COLUMN_PAUSE_DURATION*SECOND)),
            reading
        ]);
    
        const otherRiBricksDone = otherRiBricksStart.then(() => {
            return [RI_PROPRES, EMPRUNT].reduce((previousDone, id) => {
                return previousDone.then(() => {
                    const el = riParent.querySelector(RI_BRICK_SELECTOR[id]);
    
                    el.style.transitionDuration = `${BRICK_APPEAR_DURATION}s`;
                    el.style.height = `${riBrickHeights[id]}em`;
    
                    textArea.textContent = id === RI_PROPRES ?
                        `Les recettes d'investissement sont constituées de dotations de l’Etat et de subventions mais peuvent également provenir de la vente de patrimoine` :
                        `Les emprunts permettent au Département d'atteindre l’équilibre budgétaire et
                        d’investir dans des projets d’ampleur ou durables.`
                    
                    reading = delay(READING_TIME*SECOND)();

                    return Promise.all([
                        new Promise(resolve => {
                            el.addEventListener('transitionend', resolve, { once: true })
                        }),
                        reading
                    ])
                    .then(delay(BETWEEN_BRICK_PAUSE_DURATION*SECOND))
                })
            }, Promise.resolve());
        });
    
        // DI bricks
        const diBricksStart = Promise.all([
            otherRiBricksDone.then(delay(BETWEEN_COLUMN_PAUSE_DURATION*SECOND)),
            reading
        ]);

        reading = diBricksStart
        .then(() => {
            textArea.textContent = `L’épargne ajoutée aux recettes d'investissement et à l’emprunt va permettre le financement des dépenses d’investissement structurantes nécessaires au développement du territoire girondin : collèges, routes bâtiments, subventions aux partenaires territoriaux (communes, bailleurs sociaux…)`
        })
        .then( delay(READING_TIME*SECOND) );
    
        const diBricksDone = diBricksStart.then(() => {
    
            riEmptier.style.transitionDuration = `${BRICK_APPEAR_DURATION}s`;
            let riEmptierHeight = 0;
    
            diDefs.style.opacity = 1;
            const diParent = container.querySelector('.brick.di')
    
            return [REMBOURSEMENT_DETTE, INFRASTRUCTURE, SUBVENTIONS].reduce((previousDone, id, i, arr) => {
                return previousDone.then(() => {
                    const el = diParent.querySelector(DI_BRICK_SELECTOR[id]);
    
                    el.style.transitionDuration = `${BRICK_APPEAR_DURATION}s`;
                    el.style.height = `${diBrickHeights[id]}em`;
    
                    riEmptierHeight += diBrickHeights[id];
                    if(i >= 1){
                        riEmptierHeight += IN_BETWEEN_BRICK_SPACE;
                    }
                    if(i === arr.length - 1){ // last
                        riEmptier.style.height = `100%`;
                    }
                    else{
                        riEmptier.style.height = `${riEmptierHeight}em`
                    }
    
                    return new Promise(resolve => {
                        el.addEventListener('transitionend', resolve, { once: true })
                    })
                    .then(delay(BETWEEN_BRICK_PAUSE_DURATION*SECOND))
                })
            }, Promise.resolve());
        });
    
        const animationEnd = Promise.all([
            diBricksDone.then(delay(BETWEEN_COLUMN_PAUSE_DURATION*SECOND)),
            reading.then(() => {
                textArea.textContent = `Chaque année le vote du compte administratif du Département valide les équilibres budgétaires issus du vote du budget. La qualité de la gestion financière permet de garantir l'exercice des missions et la capacité d'investir en faveur du développement du territoire girondin`
            })
            .then( delay(READING_TIME*SECOND) )
            .then(() => {
                textArea.textContent = '';
            })
        ]);

        
        // Replay button
        const addReplayButton = animationEnd
        .then(delay(BETWEEN_COLUMN_PAUSE_DURATION*SECOND))
        .then(() => {
            return displayPlayButton(playButton, BRICK_APPEAR_DURATION)
        })
    
        return addReplayButton;
    }

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

    const infra = Routes + Colleges + Amenagement;
    const di = RemboursementEmprunt + infra + Subventions;

    const maxAmount = max([rf, ri, df, di]);
    const maxHeight = MAX_PARENT_BRICK_SIZE_PROPORTION * (bricksContainerSize - 4*IN_BETWEEN_BRICK_SPACE);

    const amountScale = scaleLinear()
        .domain([0, maxAmount])
        .range([0, maxHeight]);

    const rfBrickHeights = {
        [DOTATION]: Math.max(amountScale(DotationEtat), MIN_BRICK_HEIGHT),
        [FISCALITE_DIRECTE]: Math.max(amountScale(FiscalitéDirecte), MIN_BRICK_HEIGHT),
        [FISCALITE_INDIRECTE]: Math.max(amountScale(FiscalitéIndirecte), MIN_BRICK_HEIGHT),
        [RECETTES_DIVERSES]: Math.max(amountScale(RecettesDiverses), MIN_BRICK_HEIGHT)
    };

    const dfBrickHeights = {
        [SOLIDARITE]: Math.max(amountScale(Solidarité), MIN_BRICK_HEIGHT),
        [INTERVENTIONS]: Math.max(amountScale(Interventions), MIN_BRICK_HEIGHT),
        [STRUCTURE]: Math.max(amountScale(DépensesStructure), MIN_BRICK_HEIGHT)
    };

    const empruntHeight = Math.max(amountScale(Emprunt), MIN_BRICK_HEIGHT);

    const riBrickHeights = {
        [EPARGNE]: empruntHeight*2, // business rule
        [RI_PROPRES]: Math.max(amountScale(RIPropre), MIN_BRICK_HEIGHT),
        [EMPRUNT]: empruntHeight
    };

    const diBrickHeights = {
        [REMBOURSEMENT_DETTE]: Math.max(amountScale(RemboursementEmprunt), MIN_BRICK_HEIGHT),
        [INFRASTRUCTURE]: Math.max(amountScale(infra), MIN_BRICK_HEIGHT)*2,
        [SUBVENTIONS]: Math.max(amountScale(Subventions), MIN_BRICK_HEIGHT),
    };
    

    return {
        rf, ri, df, di,
        maxAmount,
        rfBrickHeights,
        dfBrickHeights,
        riBrickHeights,
        diBrickHeights
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
        if(!this.props.videoURL){
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

        const {
            DotationEtat, FiscalitéDirecte, FiscalitéIndirecte, RecettesDiverses,
            Solidarité, Interventions, DépensesStructure,
            RIPropre, Emprunt,
            RemboursementEmprunt, Routes, Colleges, Amenagement, Subventions,
            videoURL
        } = amounts;

        const rf = DotationEtat + FiscalitéDirecte + FiscalitéIndirecte + RecettesDiverses
        const df = Solidarité + Interventions + DépensesStructure

        const epargne = rf - df;
        const ri = epargne + RIPropre + Emprunt;

        const infra = Routes + Colleges + Amenagement;
        const di = RemboursementEmprunt + infra + Subventions;

        return React.createElement('article', 
            { 
                className: ['budget-construction', videoURL ? 'video' : ''].filter(e => e).join(' '), 
                ref: 'container' 
            },
            videoURL ?
            React.createElement('video', 
                { 
                    src: videoURL, 
                    controls: true
                }
            ) :
            React.createElement('div', { className: 'bricks' },
                DotationEtat ? [
                    React.createElement('a', 
                        { 
                            className: 'brick-column',
                            href: '#!/finance-details/RF'
                        },
                        React.createElement('div', {className: 'legend'},
                            React.createElement('div', {className: 'text'}, `Recettes de fonctionnement`),
                            React.createElement(MoneyAmount, {amount: rf})
                        ),
                        React.createElement(
                            'div',
                            {
                                className: 'brick parent rf'
                            },
                            React.createElement('div', { className: 'brick appear-by-height dotation-etat'}, 
                                Legend(`Dotation de l'Etat`, DotationEtat)
                            ),
                            React.createElement('div', { className: 'brick appear-by-height fiscalite-directe' }, 
                                Legend('Fiscalité directe', FiscalitéDirecte)
                            ),
                            React.createElement('div', { className: 'brick appear-by-height fiscalite-indirecte'}, 
                                Legend('Fiscalité indirecte', FiscalitéIndirecte)
                            ),
                            React.createElement('div', { className: 'brick appear-by-height recettes-diverses' }, 
                                Legend('Recettes diverses', RecettesDiverses)
                            ),
                            React.createElement('div', { className: 'emptier appear-by-height' })
                        )
                    ),
                    React.createElement('a', 
                        { 
                            className: 'brick-column',
                            href: '#!/finance-details/DF'
                        },
                        React.createElement('div', {className: 'legend'},
                            React.createElement('div', {className: 'text'}, `Dépenses de fonctionnement`),
                            React.createElement(MoneyAmount, {amount: df})
                        ),
                        React.createElement(
                            'div',
                            {
                                className: 'brick parent df'
                            },
                            React.createElement('div', { className: 'brick appear-by-height solidarite' }, 
                                Legend(`Solidarité`, Solidarité)
                            ),
                            React.createElement('div', { className: 'brick appear-by-height interventions' }, 
                                Legend('Interventions (SDIS …)', Interventions)
                            ),
                            React.createElement('div', { className: 'brick appear-by-height depenses-structure' }, 
                                Legend('Autres (personnel …)', DépensesStructure)
                            )
                        )
                    ),
                    React.createElement('a', 
                        { 
                            className: 'brick-column',
                            href: '#!/finance-details/RI'
                        },
                        React.createElement('div', {className: 'legend'},
                            React.createElement('div', {className: 'text'}, `Recettes d'investissement`),
                            React.createElement(MoneyAmount, {amount: ri})
                        ),
                        React.createElement(
                            'div',
                            {
                                className: 'brick parent ri'
                            },
                            React.createElement('div', { className: 'brick appear-by-height ri-propres' }, 
                                Legend(`Recettes d'investissement`, RIPropre)
                            ),
                            React.createElement('div', { className: 'brick appear-by-height emprunt' }, 
                                Legend('Emprunts', Emprunt)
                            ),
                            React.createElement('div', { className: 'brick appear-by-height epargne' }, 
                                Legend(`Épargne`, epargne)
                            ),
                            React.createElement('div', { className: 'emptier appear-by-height' })
                        )
                    ),
                    React.createElement('a', 
                        { 
                            className: 'brick-column',
                            href: '#!/finance-details/DI'
                        },
                        React.createElement('div', {className: 'legend'},
                            React.createElement('div', {className: 'text'}, `Dépenses d'investissement`),
                            React.createElement(MoneyAmount, {amount: di})
                        ),
                        React.createElement(
                            'div',
                            {
                                className: 'brick parent di'
                            },
                            React.createElement('div', { className: 'brick appear-by-height remboursement-emprunt' }, 
                                Legend(`Remboursement Emprunts`, RemboursementEmprunt)
                            ),
                            React.createElement('div', { className: 'brick appear-by-height infra' }, 
                                Legend(`ROUTES + COLLÈGES + BÂTIMENTS + AMÉNAGEMENT`, infra)
                            ),
                            React.createElement('div', { className: 'brick appear-by-height subventions' }, 
                                Legend(`Subventions`, Subventions)
                            )
                        )
                    )
                ] : undefined
            ),
            videoURL ? undefined : React.createElement(PrimaryCallToAction, { className: 'play' }, 
                React.createElement('i',  { className: 'fa fa-play-circle-o' }),
                ` Montrer la construction du budget`
            ),
            videoURL ? undefined : React.createElement('div', { className: 'text-area' }, ''),
            videoURL ? undefined : React.createElement('hr'),
            React.createElement('dl', {},
                React.createElement('a', { className: 'column rf', href: '#!/finance-details/RF' },
                    React.createElement('dt', {}, 'Recettes de fonctionnement'),
                    React.createElement('dd', {}, `Ces recettes proviennent principalement du produit des impôts et taxes directes et indirectes, ainsi que des dotations versées par l'État`),
                    React.createElement(PrimaryCallToAction, {text: 'explorer'})
                ),
                React.createElement('a', { className: 'column df', href: '#!/finance-details/DF' },
                    React.createElement('dt', {}, 'Dépenses de fonctionnement'),
                    React.createElement('dd', {}, `Ces dépenses financent principalement les allocations et prestations sociales ou de solidarité, les services de secours (pompiers), les transports, les collèges, les routes, ainsi que le fonctionnement propre du Département (salaires et moyens) et les intérêts d’emprunts.`),
                    React.createElement(PrimaryCallToAction, {text: 'explorer'})
                ),
                React.createElement('a', { className: 'column ri', href: '#!/finance-details/RI' },
                    React.createElement('dt', {}, 'Recettes d’investissement'),
                    React.createElement('dd', {}, `Elles sont principalement constituées de dotations de l’Etat et de subventions`),
                    React.createElement('dt', {}, 'Emprunt'),
                    React.createElement('dd', {}, `Il permet au Département d'atteindre l’équilibre budgétaire et d’investir dans des projets d’ampleur ou durables.`),
                    React.createElement(PrimaryCallToAction, {text: 'explorer'})
                ),
                React.createElement('a', { className: 'column di', href: '#!/finance-details/DI' },
                    React.createElement('dt', {}, `Dépenses d'investissement`),
                    React.createElement('dd', {}, `Elles concernent des programmes structurants ou stratégiques pour le développement du territoire girondin : bâtiments, routes, collèges, etc.`),
                    React.createElement(PrimaryCallToAction, {text: 'explorer'})
                )
            )
        );
    }
}
