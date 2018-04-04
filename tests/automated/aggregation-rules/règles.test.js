import * as matchers from 'jest-immutable-matchers';
import { OrderedSet as ImmutableSet } from 'immutable';
import m52ToAggregated from '../../../src/shared/js/finance/m52ToAggregated';
import { LigneBudgetRecord, DocumentBudgetaire } from '../../../src/shared/js/finance/DocBudgDataStructures';

jest.addMatchers(matchers);

/**
 * RF - Recettes de Fonctionnement 
 * 
 */

// RF-1-1
test("RF-1-1 : contient l'article 73111", () => {
    const AMOUNT = 37;
    const AGGREGATED_ROW_ID = 'RF-1-1';

    const m52Row = new LigneBudgetRecord({
        'CodRD': 'R',
        'FI': 'F',
        'Fonction': 'FFF',
        'Nature': '73111',
        'Chapitre': 'CCC',
        'MtReal': AMOUNT
    })
    const instruction = new DocumentBudgetaire({ rows: new ImmutableSet([m52Row]) });

    const aggVision = m52ToAggregated(instruction);

    const aggRF11 = aggVision.find(row => row.id === AGGREGATED_ROW_ID);

    expect(aggRF11.M52Rows.first()).toBe(m52Row);
});

test("RF-1-1 : contient R 01 73111", () => {
    const AMOUNT = 40;
    const AGGREGATED_ROW_ID = 'RF-1-1';

    const m52Rows = [
        new LigneBudgetRecord({
            'CodRD': 'R',
            'FI': 'F',
            'Fonction': '01',
            'Nature': '73111',
            'Chapitre': '731',
            'MtReal': AMOUNT
        })
    ];

    const instruction = new DocumentBudgetaire({ rows: new ImmutableSet(m52Rows) });

    const aggVision = m52ToAggregated(instruction);

    const aggDF37 = aggVision.find(row => row.id === AGGREGATED_ROW_ID);

    expect(aggDF37.M52Rows.first()).toBe(m52Rows[0]);
});

test("RF-1-1 : ne contient pas R 221 7788", () => {
    const AMOUNT = 41;
    const AGGREGATED_ROW_ID = 'RF-1-1';

    const m52Rows = [
        new LigneBudgetRecord({
            'CodRD': 'R',
            'FI': 'F',
            'Fonction': '221',
            'Nature': '7788',
            'Chapitre': '77',
            'MtReal': AMOUNT
        })
    ];

    const instruction = new DocumentBudgetaire({ rows: new ImmutableSet(m52Rows) });

    const aggVision = m52ToAggregated(instruction);

    const aggDF37 = aggVision.find(row => row.id === AGGREGATED_ROW_ID);

    expect(aggDF37.M52Rows.size).toBe(0);
});

test("RF-1-1 : ne contient pas R 567 7788", () => {
    const AMOUNT = 44;
    const AGGREGATED_ROW_ID = 'RF-1-1';

    const m52Rows = [
        new LigneBudgetRecord({
            'CodRD': 'R',
            'FI': 'F',
            'Fonction': '567',
            'Nature': '7788',
            'Chapitre': '017',
            'MtReal': AMOUNT
        })
    ];

    const instruction = new DocumentBudgetaire({ rows: new ImmutableSet(m52Rows) });

    const aggVision = m52ToAggregated(instruction);

    const aggRow = aggVision.find(row => row.id === AGGREGATED_ROW_ID);

    expect(aggRow.M52Rows.size).toBe(0);
});


// RF-4-3
test("RF-4-3 : contient R 01 7353", () => {
    const AMOUNT = 43;
    const AGGREGATED_ROW_ID = 'RF-4-3';

    const m52Rows = [
        new LigneBudgetRecord({
            'CodRD': 'R',
            'FI': 'F',
            'Fonction': '01',
            'Nature': '7353',
            'Chapitre': '73',
            'MtReal': AMOUNT
        })
    ];

    const instruction = new DocumentBudgetaire({ rows: new ImmutableSet(m52Rows) });

    const aggVision = m52ToAggregated(instruction);

    const aggRow = aggVision.find(row => row.id === AGGREGATED_ROW_ID);

    expect(aggRow.M52Rows.first()).toBe(m52Rows[0]);
});

// RF-4-4
test("RF-4-4 : ne contient pas R 01 7353", () => {
    const AMOUNT = 43;
    const AGGREGATED_ROW_ID = 'RF-4-4';

    const m52Rows = [
        new LigneBudgetRecord({
            'CodRD': 'R',
            'FI': 'F',
            'Fonction': '01',
            'Nature': '7353',
            'Chapitre': '73',
            'MtReal': AMOUNT
        })
    ];

    const instruction = new DocumentBudgetaire({ rows: new ImmutableSet(m52Rows) });

    const aggVision = m52ToAggregated(instruction);

    const aggRow = aggVision.find(row => row.id === AGGREGATED_ROW_ID);

    expect(aggRow.M52Rows.size).toBe(0);
});


// RF-6-1
test("RF-6-1 : contient R 567 75342 et R 567 75343", () => {
    const AMOUNT = 45;
    const AGGREGATED_ROW_ID = 'RF-6-1';

    const m52Rows = [
        new LigneBudgetRecord({
            'CodRD': 'R',
            'FI': 'F',
            'Fonction': '567',
            'Nature': '75342',
            'Chapitre': '017',
            'MtReal': AMOUNT
        }),
        new LigneBudgetRecord({
            'CodRD': 'R',
            'FI': 'F',
            'Fonction': '567',
            'Nature': '75343',
            'Chapitre': '017',
            'MtReal': AMOUNT
        })
    ];

    const instruction = new DocumentBudgetaire({ rows: new ImmutableSet(m52Rows) });

    const aggVision = m52ToAggregated(instruction);

    const aggRow = aggVision.find(row => row.id === AGGREGATED_ROW_ID);

    expect(aggRow.M52Rows.size).toBe(2);
    expect(aggRow.M52Rows.has(m52Rows[0])).toBe(true);
    expect(aggRow.M52Rows.has(m52Rows[1])).toBe(true);
});



// RF-9-2
test("RF-9-2 : contient R 0202 7875", () => {
    const AMOUNT = 40;
    const AGGREGATED_ROW_ID = 'RF-9-2';

    const m52Rows = [
        new LigneBudgetRecord({
            'CodRD': 'R',
            'FI': 'F',
            'Fonction': '0202',
            'Nature': '7875',
            'Chapitre': '78',
            'MtReal': AMOUNT
        })
    ];

    const instruction = new DocumentBudgetaire({ rows: new ImmutableSet(m52Rows) });

    const aggVision = m52ToAggregated(instruction);

    const aggDF37 = aggVision.find(row => row.id === AGGREGATED_ROW_ID);

    expect(aggDF37.M52Rows.size).toBe(1);
});

test("RF-9-2 : ne contient pas R 567 7788", () => {
    const AMOUNT = 44;
    const AGGREGATED_ROW_ID = 'RF-9-2';

    const m52Rows = [
        new LigneBudgetRecord({
            'CodRD': 'R',
            'FI': 'F',
            'Fonction': '567',
            'Nature': '7788',
            'Chapitre': '017',
            'MtReal': AMOUNT
        })
    ];

    const instruction = new DocumentBudgetaire({ rows: new ImmutableSet(m52Rows) });

    const aggVision = m52ToAggregated(instruction);

    const aggRow = aggVision.find(row => row.id === AGGREGATED_ROW_ID);

    expect(aggRow.M52Rows.first()).toBe(undefined);
});


// RF-9-7
test("RF-9-7 : ne contient pas l'article 7513", () => {
    const AMOUNT = 42;
    const AGGREGATED_ROW_ID = 'RF-9-7';

    const m52Rows = [
        new LigneBudgetRecord({
            'CodRD': 'R',
            'FI': 'F',
            'Fonction': 'FFF',
            'Nature': '7513',
            'Chapitre': 'CCC',
            'MtReal': AMOUNT
        })
    ];

    const instruction = new DocumentBudgetaire({ rows: new ImmutableSet(m52Rows) });

    const aggVision = m52ToAggregated(instruction);

    const aggDF37 = aggVision.find(row => row.id === AGGREGATED_ROW_ID);

    expect(aggDF37.M52Rows.size).toBe(0);
});

test("RF-9-7 : ne contient pas R 567 75342 et R 567 75343", () => {
    const AMOUNT = 45;
    const AGGREGATED_ROW_ID = 'RF-9-7';

    const m52Rows = [
        new LigneBudgetRecord({
            'CodRD': 'R',
            'FI': 'F',
            'Fonction': '567',
            'Nature': '75342',
            'Chapitre': '017',
            'MtReal': AMOUNT
        }),
        new LigneBudgetRecord({
            'CodRD': 'R',
            'FI': 'F',
            'Fonction': '567',
            'Nature': '75343',
            'Chapitre': '017',
            'MtReal': AMOUNT
        })
    ];

    const instruction = new DocumentBudgetaire({ rows: new ImmutableSet(m52Rows) });

    const aggVision = m52ToAggregated(instruction);

    const aggRow = aggVision.find(row => row.id === AGGREGATED_ROW_ID);

    expect(aggRow.M52Rows.size).toBe(0);
});



/**
 * DF - Dépenses de Fonctionnement 
 * 
 */

test("DF-1-7-2 : contient D 538 6568", () => {
    const AGGREGATED_ROW_ID = 'DF-1-7-2';

    const m52Rows = [
        new LigneBudgetRecord({
            'CodRD': 'D',
            'FI': 'F',
            'Fonction': '538',
            'Nature': '6568',
            'Chapitre': '65',
            'MtReal': 1
        })
    ];

    const instruction = new DocumentBudgetaire({ rows: new ImmutableSet(m52Rows) });

    const aggVision = m52ToAggregated(instruction);

    const aggDF172 = aggVision.find(row => row.id === AGGREGATED_ROW_ID);

    expect(aggDF172.M52Rows.first()).toBe(m52Rows[0]);
});

test("DF-3-6 : ne contient pas d'article commençant par 657 des fonctions 4, 5 et 8", () => {
    const AMOUNT = 38;
    const AGGREGATED_ROW_ID = 'DF-3-6';

    const m52Rows = [
        new LigneBudgetRecord({
            'CodRD': 'D',
            'FI': 'F',
            'Fonction': '4',
            'Nature': '65711',
            'MtReal': AMOUNT
        }),
        new LigneBudgetRecord({
            'CodRD': 'D',
            'FI': 'F',
            'Fonction': '5',
            'Nature': '65722',
            'MtReal': AMOUNT
        }),
        new LigneBudgetRecord({
            'CodRD': 'D',
            'FI': 'F',
            'Fonction': '8',
            'Nature': '65733',
            'MtReal': AMOUNT
        })
    ];

    const instruction = new DocumentBudgetaire({ rows: new ImmutableSet(m52Rows) });

    const aggVision = m52ToAggregated(instruction);

    const aggDF37 = aggVision.find(row => row.id === AGGREGATED_ROW_ID);

    expect(aggDF37.M52Rows.size).toBe(0);
});

test("DF-3-6 : contient D 311 6574", () => {
    const AMOUNT = 39;
    const AGGREGATED_ROW_ID = 'DF-3-6';

    const m52Rows = [
        new LigneBudgetRecord({
            'CodRD': 'D',
            'FI': 'F',
            'Fonction': '311',
            'Nature': '6574',
            'Chapitre': '65',
            'MtReal': AMOUNT
        })
    ];

    const instruction = new DocumentBudgetaire({ rows: new ImmutableSet(m52Rows) });

    const aggVision = m52ToAggregated(instruction);

    const aggDF37 = aggVision.find(row => row.id === AGGREGATED_ROW_ID);

    expect(aggDF37.M52Rows.first()).toBe(m52Rows[0]);
});


test("DF-5 : contient D 01 73913/73914/73926/739261/739262", () => {
    const AGGREGATED_ROW_ID = 'DF-5';

    const m52Rows = [
        new LigneBudgetRecord({
            'CodRD': 'D',
            'FI': 'F',
            'Fonction': '01',
            'Nature': '73913',
            'Chapitre': '014',
            'MtReal': 1
        }),
        new LigneBudgetRecord({
            'CodRD': 'D',
            'FI': 'F',
            'Fonction': '01',
            'Nature': '73914',
            'Chapitre': '014',
            'MtReal': 2
        }),
        new LigneBudgetRecord({
            'CodRD': 'D',
            'FI': 'F',
            'Fonction': '01',
            'Nature': '73926',
            'Chapitre': '014',
            'MtReal': 3
        }),
        new LigneBudgetRecord({
            'CodRD': 'D',
            'FI': 'F',
            'Fonction': '01',
            'Nature': '739261',
            'Chapitre': '014',
            'MtReal': 4
        }),
        new LigneBudgetRecord({
            'CodRD': 'D',
            'FI': 'F',
            'Fonction': '01',
            'Nature': '739262',
            'Chapitre': '014',
            'MtReal': 5
        })
    ];

    const instruction = new DocumentBudgetaire({ rows: new ImmutableSet(m52Rows) });

    const aggVision = m52ToAggregated(instruction);

    const aggDF5 = aggVision.find(row => row.id === AGGREGATED_ROW_ID);

    expect(aggDF5.M52Rows.includes(m52Rows[0])).toBe(true);
    expect(aggDF5.M52Rows.includes(m52Rows[1])).toBe(true);
    expect(aggDF5.M52Rows.includes(m52Rows[2])).toBe(true);
    expect(aggDF5.M52Rows.includes(m52Rows[3])).toBe(true);
    expect(aggDF5.M52Rows.includes(m52Rows[4])).toBe(true);
});



test("D 50 64121 est dans DF-1-1-2 et DF-2-4, mais pas dans DF-4", () => {
    const m52Rows = [
        new LigneBudgetRecord({
            'CodRD': 'D',
            'FI': 'F',
            'Fonction': '50',
            'Nature': '64121',
            'Chapitre': '012',
            'MtReal': 46
        })
    ];
    const instruction = new DocumentBudgetaire({ rows: new ImmutableSet(m52Rows) });

    const aggVision = m52ToAggregated(instruction);

    const aggDF113 = aggVision.find(row => row.id === 'DF-1-1-3');
    const aggDF24 = aggVision.find(row => row.id === 'DF-2-4');
    const aggDF4 = aggVision.find(row => row.id === 'DF-4');

    expect(aggDF113.M52Rows.includes(m52Rows[0])).toBe(true);
    expect(aggDF24.M52Rows.includes(m52Rows[0])).toBe(true);
    expect(aggDF4.M52Rows.includes(m52Rows[0])).toBe(false);
});

test("D 50 64126 est dans DF-1-1-3 et DF-2-4, mais pas dans DF-4", () => {
    const m52Rows = [
        new LigneBudgetRecord({
            'CodRD': 'D',
            'FI': 'F',
            'Fonction': '50',
            'Nature': '64126',
            'Chapitre': '012',
            'MtReal': 47
        })
    ];
    const instruction = new DocumentBudgetaire({ rows: new ImmutableSet(m52Rows) });

    const aggVision = m52ToAggregated(instruction);

    const aggDF113 = aggVision.find(row => row.id === 'DF-1-1-3');
    const aggDF24 = aggVision.find(row => row.id === 'DF-2-4');
    const aggDF4 = aggVision.find(row => row.id === 'DF-4');

    expect(aggDF113.M52Rows.includes(m52Rows[0])).toBe(true);
    expect(aggDF24.M52Rows.includes(m52Rows[0])).toBe(true);
    expect(aggDF4.M52Rows.includes(m52Rows[0])).toBe(false);
});

test("D 51 6251 est dans DF-1-1-3", () => {
    const m52Rows = [
        new LigneBudgetRecord({
            'CodRD': 'D',
            'FI': 'F',
            'Fonction': '51',
            'Nature': '6251',
            'Chapitre': '012',
            'MtReal': 47
        })
    ];
    const instruction = new DocumentBudgetaire({ rows: new ImmutableSet(m52Rows) });

    const aggVision = m52ToAggregated(instruction);

    const aggDF113 = aggVision.find(row => row.id === 'DF-1-1-3');

    expect(aggDF113.M52Rows.includes(m52Rows[0])).toBe(true);
});

test("Avant 2017, D 50 6451 est ni dans DF-1-1-3 ni DF-2-4 ni DF-4", () => {
    const m52Rows = [
        new LigneBudgetRecord({
            'CodRD': 'D',
            'FI': 'F',
            'Fonction': '50',
            'Nature': '6451',
            'Chapitre': '012',
            'MtReal': 50
        })
    ];
    const exer = 2016;

    const instruction = new DocumentBudgetaire({ rows: new ImmutableSet(m52Rows), Exer: exer });

    const aggVision = m52ToAggregated(instruction);

    const aggDF113 = aggVision.find(row => row.id === 'DF-1-1-3');
    const aggDF24 = aggVision.find(row => row.id === 'DF-2-4');
    const aggDF4 = aggVision.find(row => row.id === 'DF-4');

    expect(aggDF113.M52Rows.includes(m52Rows[0])).toBe(false);
    expect(aggDF24.M52Rows.includes(m52Rows[0])).toBe(false);
    expect(aggDF4.M52Rows.includes(m52Rows[0])).toBe(false);
});

test("Après 2017 inclus, D 50 6451 est dans DF-4", () => {
    const m52Rows = [
        new LigneBudgetRecord({
            'CodRD': 'D',
            'FI': 'F',
            'Fonction': '50',
            'Nature': '6451',
            'Chapitre': '012',
            'MtReal': 50
        })
    ];
    const exer = 2017;

    const instruction = new DocumentBudgetaire({ rows: new ImmutableSet(m52Rows), Exer: exer });

    const aggVision = m52ToAggregated(instruction);

    const aggDF4 = aggVision.find(row => row.id === 'DF-4');

    expect(aggDF4.M52Rows.includes(m52Rows[0])).toBe(true);
});

test("Avant 2017, D 50 6453 est ni dans DF-1-1-3 ni DF-2-4 ni DF-4", () => {
    const m52Rows = [
        new LigneBudgetRecord({
            'CodRD': 'D',
            'FI': 'F',
            'Fonction': '50',
            'Nature': '6453',
            'Chapitre': '012',
            'MtReal': 50
        })
    ];
    const exer = 2016;

    const instruction = new DocumentBudgetaire({ rows: new ImmutableSet(m52Rows), Exer: exer });

    const aggVision = m52ToAggregated(instruction);

    const aggDF113 = aggVision.find(row => row.id === 'DF-1-1-3');
    const aggDF24 = aggVision.find(row => row.id === 'DF-2-4');
    const aggDF4 = aggVision.find(row => row.id === 'DF-4');

    expect(aggDF113.M52Rows.includes(m52Rows[0])).toBe(false);
    expect(aggDF24.M52Rows.includes(m52Rows[0])).toBe(false);
    expect(aggDF4.M52Rows.includes(m52Rows[0])).toBe(false);
});

test("Après 2017 inclus, D 50 6453 est dans DF-4", () => {
    const m52Rows = [
        new LigneBudgetRecord({
            'CodRD': 'D',
            'FI': 'F',
            'Fonction': '50',
            'Nature': '6453',
            'Chapitre': '012',
            'MtReal': 50
        })
    ];
    const exer = 2017;

    const instruction = new DocumentBudgetaire({ rows: new ImmutableSet(m52Rows), Exer: exer });

    const aggVision = m52ToAggregated(instruction);

    const aggDF4 = aggVision.find(row => row.id === 'DF-4');

    expect(aggDF4.M52Rows.includes(m52Rows[0])).toBe(true);
});

test("Avant 2017, D 50 6454 est ni dans DF-1-1-3 ni DF-2-4 ni DF-4", () => {
    const m52Rows = [
        new LigneBudgetRecord({
            'CodRD': 'D',
            'FI': 'F',
            'Fonction': '50',
            'Nature': '6454',
            'Chapitre': '012',
            'MtReal': 50
        })
    ];
    const exer = 2016;

    const instruction = new DocumentBudgetaire({ rows: new ImmutableSet(m52Rows), Exer: exer });

    const aggVision = m52ToAggregated(instruction);

    const aggDF113 = aggVision.find(row => row.id === 'DF-1-1-3');
    const aggDF24 = aggVision.find(row => row.id === 'DF-2-4');
    const aggDF4 = aggVision.find(row => row.id === 'DF-4');

    expect(aggDF113.M52Rows.includes(m52Rows[0])).toBe(false);
    expect(aggDF24.M52Rows.includes(m52Rows[0])).toBe(false);
    expect(aggDF4.M52Rows.includes(m52Rows[0])).toBe(false);
});

test("Après 2017 inclus, D 50 6454 est dans DF-4", () => {
    const m52Rows = [
        new LigneBudgetRecord({
            'CodRD': 'D',
            'FI': 'F',
            'Fonction': '50',
            'Nature': '6454',
            'Chapitre': '012',
            'MtReal': 50
        })
    ];
    const exer = 2017;

    const instruction = new DocumentBudgetaire({ rows: new ImmutableSet(m52Rows), Exer: exer });

    const aggVision = m52ToAggregated(instruction);

    const aggDF4 = aggVision.find(row => row.id === 'DF-4');

    expect(aggDF4.M52Rows.includes(m52Rows[0])).toBe(true);
});


test("D 51 65111 n'est pas dans DF-1-7-2", () => {
    const m52Rows = [
        new LigneBudgetRecord({
            'CodRD': 'D',
            'FI': 'F',
            'Fonction': '51',
            'Nature': '65111',
            'Chapitre': '65',
            'MtReal': 76
        })
    ];
    const instruction = new DocumentBudgetaire({ rows: new ImmutableSet(m52Rows) });

    const aggVision = m52ToAggregated(instruction);

    const aggDF172 = aggVision.find(row => row.id === 'DF-1-7-2');
    expect(aggDF172.M52Rows.includes(m52Rows[0])).toBe(false);
});


test("D 52 6568 n'est pas dans DF-3-3 (est dans une correction à partir de 2017)", () => {
    const m52Rows = [
        new LigneBudgetRecord({
            'CodRD': 'D',
            'FI': 'F',
            'Fonction': '52',
            'Nature': '6568',
            'Chapitre': '65',
            'MtReal': 76
        })
    ];
    const instruction = new DocumentBudgetaire({ rows: new ImmutableSet(m52Rows), Exer: 2017 });

    const aggVision = m52ToAggregated(instruction);

    const aggDF172 = aggVision.find(row => row.id === 'DF-3-3');
    expect(aggDF172.M52Rows.includes(m52Rows[0])).toBe(false);
});


test("D 58 6574 n'est pas dans DF-3-6 (est dans une correction)", () => {
    const m52Rows = [
        new LigneBudgetRecord({
            'CodRD': 'D',
            'FI': 'F',
            'Fonction': '58',
            'Nature': '6574',
            'Chapitre': '65',
            'MtReal': 76
        })
    ];
    const instruction = new DocumentBudgetaire({ rows: new ImmutableSet(m52Rows) });

    const aggVision = m52ToAggregated(instruction);

    const aggDF172 = aggVision.find(row => row.id === 'DF-3-6');
    expect(aggDF172.M52Rows.includes(m52Rows[0])).toBe(false);
});


/**
 * DI - Dépenses d'Investissement
 */

test("DI-2-4 contient D 621 204182, mais pas DI-1-2", () => {

    const m52Rows = [
        new LigneBudgetRecord({
            'CodRD': 'D',
            'FI': 'I',
            'Fonction': '621',
            'Nature': '204182',
            'Chapitre': '204',
            'MtReal': 1
        })
    ];

    const instruction = new DocumentBudgetaire({ rows: new ImmutableSet(m52Rows) });

    const aggVision = m52ToAggregated(instruction);

    const aggDI24 = aggVision.find(row => row.id === 'DI-2-4');
    const aggDI12 = aggVision.find(row => row.id === 'DI-1-2');

    expect(aggDI24.M52Rows.first()).toBe(m52Rows[0]);
    expect(aggDI12.M52Rows.size).toBe(0);
});


test("DI-1-2 contient D 52 23151, mais pas DI-1-3", () => {

    const m52Rows = [
        new LigneBudgetRecord({
            'CodRD': 'D',
            'FI': 'I',
            'Fonction': '52',
            'Nature': '23151',
            'Chapitre': '23',
            'MtReal': 1
        })
    ];

    const instruction = new DocumentBudgetaire({ rows: new ImmutableSet(m52Rows) });

    const aggVision = m52ToAggregated(instruction);

    const aggDI12 = aggVision.find(row => row.id === 'DI-1-2');
    const aggDI13 = aggVision.find(row => row.id === 'DI-1-3');

    expect(aggDI12.M52Rows.first()).toBe(m52Rows[0]);
    expect(aggDI13.M52Rows.size).toBe(0);
});


test("DI-1-5 contient D 41 2188, mais pas DI-1-3", () => {

    const m52Rows = [
        new LigneBudgetRecord({
            'CodRD': 'D',
            'FI': 'I',
            'Fonction': '41',
            'Nature': '2188',
            'Chapitre': '21',
            'MtReal': 1
        })
    ];

    const instruction = new DocumentBudgetaire({ rows: new ImmutableSet(m52Rows) });

    const aggVision = m52ToAggregated(instruction);

    const aggDI15 = aggVision.find(row => row.id === 'DI-1-5');
    const aggDI13 = aggVision.find(row => row.id === 'DI-1-3');

    expect(aggDI15.M52Rows.first()).toBe(m52Rows[0]);
    expect(aggDI13.M52Rows.size).toBe(0);
});


test("DI-1-3 contient D 18 1321, mais pas DI-2-4", () => {

    const m52Rows = [
        new LigneBudgetRecord({
            'CodRD': 'D',
            'FI': 'I',
            'Fonction': '18',
            'Nature': '1321',
            'Chapitre': '13',
            'MtReal': 1
        })
    ];

    const instruction = new DocumentBudgetaire({ rows: new ImmutableSet(m52Rows) });

    const aggVision = m52ToAggregated(instruction);

    const aggDI15 = aggVision.find(row => row.id === 'DI-1-3');
    const aggDI13 = aggVision.find(row => row.id === 'DI-2-4');

    expect(aggDI15.M52Rows.first()).toBe(m52Rows[0]);
    expect(aggDI13.M52Rows.size).toBe(0);
});


test("D 50 231351 est dans DI-1-3", () => {

    const m52Rows = [
        new LigneBudgetRecord({
            'CodRD': 'D',
            'FI': 'I',
            'Fonction': '50',
            'Nature': '231351',
            'Chapitre': '23',
            'MtReal': 1
        })
    ];

    const instruction = new DocumentBudgetaire({ rows: new ImmutableSet(m52Rows) });

    const aggVision = m52ToAggregated(instruction);

    const aggDI13 = aggVision.find(row => row.id === 'DI-1-3');

    expect(aggDI13.M52Rows.first()).toBe(m52Rows[0]);
});

