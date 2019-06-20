import {readFileSync} from 'fs'
import {join} from 'path'
import { OrderedSet as ImmutableSet } from 'immutable';

import * as matchers from 'jest-immutable-matchers';
import {DOMParser} from 'xmldom';

import {fromXMLDocument} from '../../../src/shared/js/finance/planDeCompte.js'
import makeAggregateFunction from '../../../src/shared/js/finance/makeAggregateFunction.js'
import { LigneBudgetRecord, DocumentBudgetaire } from '../../../src/shared/js/finance/DocBudgDataStructures';
import {flattenTree} from '../../../src/shared/js/finance/visitHierarchical';

import aggregationDescription from '../../../data/finances/description-agrégation.json'

jest.addMatchers(matchers);


const [aggregate2016, aggregate2017, aggregate2018] = ['2016', '2017', '2018']
    .map(year => {
        return readFileSync(
            join(__dirname, '..', '..', '..', 'data', 'finances', 'plansDeCompte', `plan-de-compte-M52-M52-${year}.xml`),
            'utf8'
        )
    })
    .map(planDeCompteXMLString => (new DOMParser()).parseFromString(planDeCompteXMLString, "text/xml"))
    .map(fromXMLDocument)
    .map(planDeCompte => makeAggregateFunction(aggregationDescription, planDeCompte))


/**
 * RF - Recettes de Fonctionnement 
 * 
 */

// RF.1.1
test("RF.1.1 : contient l'article 73111", () => {
    const AMOUNT = 37;
    const AGGREGATED_ROW_ID = 'RF.1.1';

    const lignesBudget = [new LigneBudgetRecord({
        'CodRD': 'R',
        'Fonction': 'FFF',
        'Nature': '73111',
        'MtReal': AMOUNT
    })]

    const documentBudgetaire = new DocumentBudgetaire({ rows: new ImmutableSet(lignesBudget) });
    const aggregated = aggregate2018(documentBudgetaire)

    const aggRF11 = flattenTree(aggregated).find(node => node.id === AGGREGATED_ROW_ID)

    expect(aggRF11.elements).toContain(lignesBudget[0]);
});

test("RF.1.1 : ne contient pas R 221 7788", () => {
    const AMOUNT = 41;
    const AGGREGATED_ROW_ID = 'RF.1.1';

    const lignesBudget = [
        new LigneBudgetRecord({
            'CodRD': 'R',
            'Fonction': '221',
            'Nature': '7788',
            'MtReal': AMOUNT
        })
    ];

    const documentBudgetaire = new DocumentBudgetaire({ rows: new ImmutableSet(lignesBudget) });
    const aggregated = aggregate2018(documentBudgetaire)

    const aggRF11 = flattenTree(aggregated).find(node => node.id === AGGREGATED_ROW_ID);

    expect(aggRF11.elements.length).toBe(0);
});

test("RF.1.1 : ne contient pas R 567 7788", () => {
    const AMOUNT = 44;
    const AGGREGATED_ROW_ID = 'RF.1.1';

    const lignesBudget = [
        new LigneBudgetRecord({
            'CodRD': 'R',
            'Fonction': '567',
            'Nature': '7788',
            'MtReal': AMOUNT
        })
    ];

    const documentBudgetaire = new DocumentBudgetaire({ rows: new ImmutableSet(lignesBudget) });
    const aggregated = aggregate2018(documentBudgetaire)

    const aggRF11 = flattenTree(aggregated).find(node => node.id === AGGREGATED_ROW_ID);

    expect(aggRF11.elements.length).toBe(0);
});


// RF.4.3
test("RF-4-3 : contient R 01 7353", () => {
    const AMOUNT = 43;
    const AGGREGATED_ROW_ID = 'RF.4.3';

    const lignesBudget = [
        new LigneBudgetRecord({
            'CodRD': 'R',
            'Fonction': '01',
            'Nature': '7353',
            'MtReal': AMOUNT
        })
    ];

    const documentBudgetaire = new DocumentBudgetaire({ rows: new ImmutableSet(lignesBudget) });
    const aggregated = aggregate2018(documentBudgetaire)

    const aggRF43 = flattenTree(aggregated).find(node => node.id === AGGREGATED_ROW_ID);

    expect(aggRF43.elements).toContain(lignesBudget[0]);
});

// RF.4.4
test("RF.4.4 : ne contient pas R 01 7353", () => {
    const AMOUNT = 43;
    const AGGREGATED_ROW_ID = 'RF.4.4';

    const lignesBudget = [
        new LigneBudgetRecord({
            'CodRD': 'R',
            'Fonction': '01',
            'Nature': '7353',
            'MtReal': AMOUNT
        })
    ];

    const documentBudgetaire = new DocumentBudgetaire({ rows: new ImmutableSet(lignesBudget) });
    const aggregated = aggregate2018(documentBudgetaire)

    const aggRF44 = flattenTree(aggregated).find(node => node.id === AGGREGATED_ROW_ID);

    expect(aggRF44.elements.length).toBe(0);
});


// RF.6.1
test("RF.6.1 : contient R 567 75342 et R 567 75343", () => {
    const AMOUNT = 45;
    const AGGREGATED_ROW_ID = 'RF.6.1';

    const lignesBudget = [
        new LigneBudgetRecord({
            'CodRD': 'R',
            'Fonction': '567',
            'Nature': '75342',
            'MtReal': AMOUNT
        }),
        new LigneBudgetRecord({
            'CodRD': 'R',
            'Fonction': '567',
            'Nature': '75343',
            'MtReal': AMOUNT
        })
    ];

    const documentBudgetaire = new DocumentBudgetaire({ rows: new ImmutableSet(lignesBudget) });
    const aggregated = aggregate2018(documentBudgetaire)

    const aggRF61 = flattenTree(aggregated).find(node => node.id === AGGREGATED_ROW_ID);

    expect(aggRF61.elements.length).toBe(2);
    expect(aggRF61.elements).toContain(lignesBudget[0]);
    expect(aggRF61.elements).toContain(lignesBudget[1]);
});



// RF.9.2
test("RF.9.2 : contient R 0202 7875", () => {
    const AMOUNT = 40;
    const AGGREGATED_ROW_ID = 'RF.9.2';

    const lignesBudget = [
        new LigneBudgetRecord({
            'CodRD': 'R',
            'Fonction': '0202',
            'Nature': '7875',
            'MtReal': AMOUNT
        })
    ];

    const documentBudgetaire = new DocumentBudgetaire({ rows: new ImmutableSet(lignesBudget) });
    const aggregated = aggregate2018(documentBudgetaire)

    const aggRF92 = flattenTree(aggregated).find(node => node.id === AGGREGATED_ROW_ID);

    expect(aggRF92.elements.length).toBe(1);
    expect(aggRF92.elements).toContain(lignesBudget[0]);
});


// RF.9.7
test("RF.9.7 : ne contient pas l'article 7513", () => {
    const AMOUNT = 42;
    const AGGREGATED_ROW_ID = 'RF.9.7';

    const lignesBudget = [
        new LigneBudgetRecord({
            'CodRD': 'R',
            'Fonction': 'FFF',
            'Nature': '7513',
            'MtReal': AMOUNT
        })
    ];

    const documentBudgetaire = new DocumentBudgetaire({ rows: new ImmutableSet(lignesBudget) });
    const aggregated = aggregate2018(documentBudgetaire)

    const aggRF97 = flattenTree(aggregated).find(node => node.id === AGGREGATED_ROW_ID);

    expect(aggRF97.elements.length).toBe(0);
});

test("RF.9.7 : ne contient pas R 567 75342 et R 567 75343", () => {
    const AMOUNT = 45;
    const AGGREGATED_ROW_ID = 'RF.9.7';

    const lignesBudget = [
        new LigneBudgetRecord({
            'CodRD': 'R',
            'Fonction': '567',
            'Nature': '75342',
            'MtReal': AMOUNT
        }),
        new LigneBudgetRecord({
            'CodRD': 'R',
            'Fonction': '567',
            'Nature': '75343',
            'MtReal': AMOUNT
        })
    ];

    const documentBudgetaire = new DocumentBudgetaire({ rows: new ImmutableSet(lignesBudget) });
    const aggregated = aggregate2018(documentBudgetaire)

    const aggRF97 = flattenTree(aggregated).find(node => node.id === AGGREGATED_ROW_ID);

    expect(aggRF97.elements.length).toBe(0);
});



/**
 * DF - Dépenses de Fonctionnement 
 * 
 */


test("DF.3.6 : ne contient pas d'article commençant par 657 des fonctions 4, 5 et 8", () => {
    const AMOUNT = 38;
    const AGGREGATED_ROW_ID = 'DF.3.6';

    const lignesBudget = [
        new LigneBudgetRecord({
            'CodRD': 'D',
            'Fonction': '4',
            'Nature': '65711',
            'MtReal': AMOUNT
        }),
        new LigneBudgetRecord({
            'CodRD': 'D',
            'Fonction': '5',
            'Nature': '65722',
            'MtReal': AMOUNT
        }),
        new LigneBudgetRecord({
            'CodRD': 'D',
            'Fonction': '8',
            'Nature': '65733',
            'MtReal': AMOUNT
        })
    ];

    const documentBudgetaire = new DocumentBudgetaire({ rows: new ImmutableSet(lignesBudget) });
    const aggregated = aggregate2018(documentBudgetaire)

    const aggDF36 = flattenTree(aggregated).find(node => node.id === AGGREGATED_ROW_ID);

    expect(aggDF36.elements.length).toBe(0);
});

test("DF.3.6 : contient D 311 6574", () => {
    const AMOUNT = 39;
    const AGGREGATED_ROW_ID = 'DF.3.6';

    const lignesBudget = [
        new LigneBudgetRecord({
            'CodRD': 'D',
            'Fonction': '311',
            'Nature': '6574',
            'MtReal': AMOUNT
        })
    ];

    const documentBudgetaire = new DocumentBudgetaire({ rows: new ImmutableSet(lignesBudget) });
    const aggregated = aggregate2018(documentBudgetaire)

    const aggDF36 = flattenTree(aggregated).find(node => node.id === AGGREGATED_ROW_ID);

    expect(aggDF36.elements).toContain(lignesBudget[0]);
});


test("DF.5 : contient D 01 73913/73914/73926/739261/739262", () => {
    const AGGREGATED_ROW_ID = 'DF.5';

    const lignesBudget = [
        new LigneBudgetRecord({
            'CodRD': 'D',
            'Fonction': '01',
            'Nature': '73913',
            'MtReal': 1
        }),
        new LigneBudgetRecord({
            'CodRD': 'D',
            'Fonction': '01',
            'Nature': '73914',
            'MtReal': 2
        }),
        new LigneBudgetRecord({
            'CodRD': 'D',
            'Fonction': '01',
            'Nature': '73926',
            'MtReal': 3
        }),
        new LigneBudgetRecord({
            'CodRD': 'D',
            'Fonction': '01',
            'Nature': '739261',
            'MtReal': 4
        }),
        new LigneBudgetRecord({
            'CodRD': 'D',
            'Fonction': '01',
            'Nature': '739262',
            'MtReal': 5
        })
    ];

    const documentBudgetaire = new DocumentBudgetaire({ rows: new ImmutableSet(lignesBudget) });
    const aggregated = aggregate2018(documentBudgetaire)

    const aggDF5 = flattenTree(aggregated).find(node => node.id === AGGREGATED_ROW_ID);

    expect(aggDF5.elements).toContain(lignesBudget[0]);
    expect(aggDF5.elements).toContain(lignesBudget[1]);
    expect(aggDF5.elements).toContain(lignesBudget[2]);
    expect(aggDF5.elements).toContain(lignesBudget[3]);
    expect(aggDF5.elements).toContain(lignesBudget[4]);
});



test("D 50 64121 est dans DF.1.1.2 et DF.2.4, mais pas dans DF.4", () => {
    const lignesBudget = [
        new LigneBudgetRecord({
            'CodRD': 'D',
            'Fonction': '50',
            'Nature': '64121',
            'MtReal': 46
        })
    ];
    const documentBudgetaire = new DocumentBudgetaire({ rows: new ImmutableSet(lignesBudget), Exer: 2016 });
    const aggregated = aggregate2016(documentBudgetaire)

    const aggDF113 = flattenTree(aggregated).find(node => node.id === 'DF.1.1.3');
    const aggDF24 = flattenTree(aggregated).find(node => node.id === 'DF.2.4');
    const aggDF4 = flattenTree(aggregated).find(node => node.id === 'DF.4');
    
    expect(aggDF113.elements).toContain(lignesBudget[0]);
    expect(aggDF24.elements).toContain(lignesBudget[0]);
    expect(aggDF4.elements).not.toContain(lignesBudget[0]);
});

test("D 50 64126 est dans DF.1.1.3 et DF.2.4, mais pas dans DF.4", () => {
    const lignesBudget = [
        new LigneBudgetRecord({
            'CodRD': 'D',
            'Fonction': '50',
            'Nature': '64126',
            'MtReal': 47
        })
    ];
    const documentBudgetaire = new DocumentBudgetaire({ rows: new ImmutableSet(lignesBudget) });
    const aggregated = aggregate2018(documentBudgetaire)

    const aggDF113 = flattenTree(aggregated).find(node => node.id === 'DF.1.1.3');
    const aggDF24 = flattenTree(aggregated).find(node => node.id === 'DF.2.4');
    const aggDF4 = flattenTree(aggregated).find(node => node.id === 'DF.4');

    expect(aggDF113.elements).toContain(lignesBudget[0]);
    expect(aggDF24.elements).toContain(lignesBudget[0]);
    expect(aggDF4.elements).not.toContain(lignesBudget[0]);
});

test("DF.1.1.3 : contient D 51 6251", () => {
    const AGGREGATED_ROW_ID = 'DF.1.1.3';

    const lignesBudget = [
        new LigneBudgetRecord({
            'CodRD': 'D',
            'Fonction': '51',
            'Nature': '6251',
            'MtReal': 47
        })
    ];
    const documentBudgetaire = new DocumentBudgetaire({ rows: new ImmutableSet(lignesBudget) });
    const aggregated = aggregate2018(documentBudgetaire)

    const aggDF113 = flattenTree(aggregated).find(node => node.id === AGGREGATED_ROW_ID);

    expect(aggDF113.elements).toContain(lignesBudget[0]);
})

test("Avant 2017, D 50 6451 est ni dans DF.1.1.3 ni DF.2.4 ni DF.4", () => {
    const lignesBudget = [
        new LigneBudgetRecord({
            'CodRD': 'D',
            'Fonction': '50',
            'Nature': '6451',
            'MtReal': 50
        })
    ];

    const Exer = 2016;

    const documentBudgetaire = new DocumentBudgetaire({ rows: new ImmutableSet(lignesBudget), Exer });
    const aggregated = aggregate2016(documentBudgetaire)

    const aggDF113 = flattenTree(aggregated).find(node => node.id === 'DF.1.1.3');
    const aggDF24 = flattenTree(aggregated).find(node => node.id === 'DF.2.4');
    const aggDF4 = flattenTree(aggregated).find(node => node.id === 'DF.4');

    expect(aggDF113.elements).not.toContain(lignesBudget[0])
    expect(aggDF24.elements).not.toContain(lignesBudget[0])
    expect(aggDF4.elements).not.toContain(lignesBudget[0])
});

test("À partir de 2017, D 50 6451 est dans DF.4", () => {
    const lignesBudget = [
        new LigneBudgetRecord({
            'CodRD': 'D',
            'Fonction': '50',
            'Nature': '6451',
            'MtReal': 50
        })
    ];
    
    const Exer = 2017;

    const documentBudgetaire = new DocumentBudgetaire({ rows: new ImmutableSet(lignesBudget), Exer });
    const aggregated = aggregate2017(documentBudgetaire)

    const aggDF4 = flattenTree(aggregated).find(node => node.id === 'DF.4');

    expect(aggDF4.elements).toContain(lignesBudget[0]);
});

test("Avant 2017, D 50 6453 est ni dans DF.1.1.3 ni DF.2.4 ni DF.4", () => {
    const lignesBudget = [
        new LigneBudgetRecord({
            'CodRD': 'D',
            'Fonction': '50',
            'Nature': '6453',
            'MtReal': 50
        })
    ];

    const Exer = 2016;

    const documentBudgetaire = new DocumentBudgetaire({ rows: new ImmutableSet(lignesBudget), Exer });
    const aggregated = aggregate2016(documentBudgetaire)

    const aggDF113 = flattenTree(aggregated).find(node => node.id === 'DF.1.1.3');
    const aggDF24 = flattenTree(aggregated).find(node => node.id === 'DF.2.4');
    const aggDF4 = flattenTree(aggregated).find(node => node.id === 'DF.4');

    expect(aggDF113.elements).not.toContain(lignesBudget[0])
    expect(aggDF24.elements).not.toContain(lignesBudget[0])
    expect(aggDF4.elements).not.toContain(lignesBudget[0])
});

test("À partir de 2017, D 50 6453 est dans DF.4", () => {
    const lignesBudget = [
        new LigneBudgetRecord({
            'CodRD': 'D',
            'Fonction': '50',
            'Nature': '6453',
            'MtReal': 50
        })
    ];
    
    const Exer = 2017;

    const documentBudgetaire = new DocumentBudgetaire({ rows: new ImmutableSet(lignesBudget), Exer });
    const aggregated = aggregate2017(documentBudgetaire)

    const aggDF4 = flattenTree(aggregated).find(node => node.id === 'DF.4');

    expect(aggDF4.elements).toContain(lignesBudget[0]);
});

test("Avant 2017, D 50 6454 est ni dans DF.1.1.3 ni DF.2.4 ni DF.4", () => {
    const lignesBudget = [
        new LigneBudgetRecord({
            'CodRD': 'D',
            'Fonction': '50',
            'Nature': '6454',
            'MtReal': 50
        })
    ];

    const Exer = 2016;

    const documentBudgetaire = new DocumentBudgetaire({ rows: new ImmutableSet(lignesBudget), Exer });
    const aggregated = aggregate2016(documentBudgetaire)

    const aggDF113 = flattenTree(aggregated).find(node => node.id === 'DF.1.1.3');
    const aggDF24 = flattenTree(aggregated).find(node => node.id === 'DF.2.4');
    const aggDF4 = flattenTree(aggregated).find(node => node.id === 'DF.4');

    expect(aggDF113.elements).not.toContain(lignesBudget[0])
    expect(aggDF24.elements).not.toContain(lignesBudget[0])
    expect(aggDF4.elements).not.toContain(lignesBudget[0])
});

test("À partir de 2017, D 50 6454 est dans DF.4", () => {
    const lignesBudget = [
        new LigneBudgetRecord({
            'CodRD': 'D',
            'Fonction': '50',
            'Nature': '6454',
            'MtReal': 50
        })
    ];
    
    const Exer = 2017;

    const documentBudgetaire = new DocumentBudgetaire({ rows: new ImmutableSet(lignesBudget), Exer });
    const aggregated = aggregate2017(documentBudgetaire)

    const aggDF4 = flattenTree(aggregated).find(node => node.id === 'DF.4');

    expect(aggDF4.elements).toContain(lignesBudget[0]);
});


test("D 51 65111 n'est pas dans DF.1.7.2", () => {
    const lignesBudget = [
        new LigneBudgetRecord({
            'CodRD': 'D',
            'Fonction': '51',
            'Nature': '65111',
            'MtReal': 76
        })
    ];

    const documentBudgetaire = new DocumentBudgetaire({ rows: new ImmutableSet(lignesBudget) });
    const aggregated = aggregate2017(documentBudgetaire)

    const aggDF172 = flattenTree(aggregated).find(node => node.id === 'DF.1.7.2');
    expect(aggDF172.elements).not.toContain(lignesBudget[0])
});



test("D 58 6574 n'est pas dans DF.3.6 (est dans une correction)", () => {
    const lignesBudget = [
        new LigneBudgetRecord({
            'CodRD': 'D',
            'Fonction': '58',
            'Nature': '6574',
            'MtReal': 76
        })
    ];
    
    const documentBudgetaire = new DocumentBudgetaire({ rows: new ImmutableSet(lignesBudget) });
    const aggregated = aggregate2017(documentBudgetaire)

    const aggDF36 = flattenTree(aggregated).find(node => node.id === 'DF.3.6');
    expect(aggDF36.elements).not.toContain(lignesBudget[0]);
});


/**
 * DI - Dépenses d'Investissement
 */

test("DI.2.4 contient D 621 204182, mais pas DI.1.2", () => {

    const lignesBudget = [
        new LigneBudgetRecord({
            'CodRD': 'D',
            'Fonction': '621',
            'Nature': '204182',
            'MtReal': 1
        })
    ];

    const documentBudgetaire = new DocumentBudgetaire({ rows: new ImmutableSet(lignesBudget) });
    const aggregated = aggregate2017(documentBudgetaire)

    const aggDI24 = flattenTree(aggregated).find(row => row.id === 'DI.2.4');
    const aggDI12 = flattenTree(aggregated).find(row => row.id === 'DI.1.2');

    expect(aggDI24.elements).toContain(lignesBudget[0]);
    expect(aggDI12.elements.length).toBe(0);
});


test("DI.1.2 contient D 52 23151, mais pas DI.1.3", () => {

    const lignesBudget = [
        new LigneBudgetRecord({
            'CodRD': 'D',
            'Fonction': '52',
            'Nature': '23151',
            'MtReal': 1
        })
    ];

    const documentBudgetaire = new DocumentBudgetaire({ rows: new ImmutableSet(lignesBudget) });
    const aggregated = aggregate2017(documentBudgetaire)

    const aggDI12 = flattenTree(aggregated).find(row => row.id === 'DI.1.2');
    const aggDI13 = flattenTree(aggregated).find(row => row.id === 'DI.1.3');

    expect(aggDI12.elements).toContain(lignesBudget[0]);
    expect(aggDI13.elements.length).toBe(0);
});


test("DI.1.5 contient D 41 2188, mais pas DI.1.3", () => {

    const lignesBudget = [
        new LigneBudgetRecord({
            'CodRD': 'D',
            'Fonction': '41',
            'Nature': '2188',
            'MtReal': 1
        })
    ];

    const documentBudgetaire = new DocumentBudgetaire({ rows: new ImmutableSet(lignesBudget) });
    const aggregated = aggregate2017(documentBudgetaire)

    const aggDI13 = flattenTree(aggregated).find(row => row.id === 'DI.1.3');
    const aggDI15 = flattenTree(aggregated).find(row => row.id === 'DI.1.5');

    expect(aggDI15.elements).toContain(lignesBudget[0]);
    expect(aggDI13.elements.length).toBe(0);
});


test("DI.1.3 contient D 18 1321, mais pas DI.2.4", () => {

    const lignesBudget = [
        new LigneBudgetRecord({
            'CodRD': 'D',
            'Fonction': '18',
            'Nature': '1321',
            'MtReal': 1
        })
    ];

    const documentBudgetaire = new DocumentBudgetaire({ rows: new ImmutableSet(lignesBudget) });
    const aggregated = aggregate2017(documentBudgetaire)

    const aggDI13 = flattenTree(aggregated).find(row => row.id === 'DI.1.3');
    const aggDI15 = flattenTree(aggregated).find(row => row.id === 'DI.1.5');

    expect(aggDI13.elements).toContain(lignesBudget[0]);
    expect(aggDI15.elements.length).toBe(0);
});


test("D 50 231351 est dans DI.1.3", () => {

    const lignesBudget = [
        new LigneBudgetRecord({
            'CodRD': 'D',
            'Fonction': '50',
            'Nature': '231351',
            'MtReal': 1
        })
    ];

    const documentBudgetaire = new DocumentBudgetaire({ rows: new ImmutableSet(lignesBudget) });
    const aggregated = aggregate2017(documentBudgetaire)

    const aggDI13 = flattenTree(aggregated).find(row => row.id === 'DI.1.3');
    
    expect(aggDI13.elements).toContain(lignesBudget[0]);
});

