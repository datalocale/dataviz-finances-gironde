import * as matchers from 'jest-immutable-matchers';
import { OrderedSet as ImmutableSet } from 'immutable';
import { rules, default as m52ToAggregated } from '../../../src/shared/js/finance/m52ToAggregated';
import { M52RowRecord, M52Instruction } from '../../../src/shared/js/finance/M52InstructionDataStructures';

const AGGREGATED_ROWS_COUNT = Object.keys(rules).length;

jest.addMatchers(matchers);

/**
 * RF - Recettes de Fonctionnement 
 * 
 */

// RF-1-1
test("RF-1-1 : contient l'article A73111", () => {
    const AMOUNT = 37;
    const AGGREGATED_ROW_ID = 'RF-1-1';

    const m52Row = new M52RowRecord({
        'Dépense/Recette': 'R',
        'Investissement/Fonctionnement': 'F',
        'Réel/Ordre id/Ordre diff': 'OR',
        'Rubrique fonctionnelle': 'RXXX',
        'Article': 'A73111',
        'Montant': AMOUNT
    })
    const instruction = new M52Instruction({ rows: new ImmutableSet([m52Row]) });

    const aggVision = m52ToAggregated(instruction);

    const aggRF11 = aggVision.find(row => row.id === AGGREGATED_ROW_ID);

    expect(aggRF11.M52Rows.first()).toBe(m52Row);
});

test("RF-1-1 : contient RF C731 R01 A73111", () => {
    const AMOUNT = 40;
    const AGGREGATED_ROW_ID = 'RF-1-1';

    const m52Rows = [
        new M52RowRecord({
            'Dépense/Recette': 'R',
            'Investissement/Fonctionnement': 'F',
            'Réel/Ordre id/Ordre diff': 'OR',
            'Rubrique fonctionnelle': 'R01',
            'Article': 'A73111',
            'Chapitre': 'C731',
            'Montant': AMOUNT
        })
    ];

    const instruction = new M52Instruction({ rows: new ImmutableSet(m52Rows) });

    const aggVision = m52ToAggregated(instruction);

    const aggDF37 = aggVision.find(row => row.id === AGGREGATED_ROW_ID);

    expect(aggDF37.M52Rows.first()).toBe(m52Rows[0]);
});

test("RF-1-1 : ne contient pas RF C77 R221 A7788", () => {
    const AMOUNT = 41;
    const AGGREGATED_ROW_ID = 'RF-1-1';

    const m52Rows = [
        new M52RowRecord({
            'Dépense/Recette': 'R',
            'Investissement/Fonctionnement': 'F',
            'Réel/Ordre id/Ordre diff': 'OR',
            'Rubrique fonctionnelle': 'R221',
            'Article': 'A7788',
            'Chapitre': 'C77',
            'Montant': AMOUNT
        })
    ];

    const instruction = new M52Instruction({ rows: new ImmutableSet(m52Rows) });

    const aggVision = m52ToAggregated(instruction);

    const aggDF37 = aggVision.find(row => row.id === AGGREGATED_ROW_ID);

    expect(aggDF37.M52Rows.size).toBe(0);
});

test("RF-1-1 : ne contient pas RF C017 R567 A7788", () => {
    const AMOUNT = 44;
    const AGGREGATED_ROW_ID = 'RF-1-1';

    const m52Rows = [
        new M52RowRecord({
            'Dépense/Recette': 'R',
            'Investissement/Fonctionnement': 'F',
            'Réel/Ordre id/Ordre diff': 'OR',
            'Rubrique fonctionnelle': 'R567',
            'Article': 'A7788',
            'Chapitre': 'C017',
            'Montant': AMOUNT
        })
    ];

    const instruction = new M52Instruction({ rows: new ImmutableSet(m52Rows) });

    const aggVision = m52ToAggregated(instruction);

    const aggRow = aggVision.find(row => row.id === AGGREGATED_ROW_ID);

    expect(aggRow.M52Rows.size).toBe(0);
});


// RF-4-3
test("RF-4-3 : contient RF C73 R01 A7353", () => {
    const AMOUNT = 43;
    const AGGREGATED_ROW_ID = 'RF-4-3';

    const m52Rows = [
        new M52RowRecord({
            'Dépense/Recette': 'R',
            'Investissement/Fonctionnement': 'F',
            'Réel/Ordre id/Ordre diff': 'OR',
            'Rubrique fonctionnelle': 'R01',
            'Article': 'A7353',
            'Chapitre': 'C73',
            'Montant': AMOUNT
        })
    ];

    const instruction = new M52Instruction({ rows: new ImmutableSet(m52Rows) });

    const aggVision = m52ToAggregated(instruction);

    const aggRow = aggVision.find(row => row.id === AGGREGATED_ROW_ID);

    expect(aggRow.M52Rows.first()).toBe(m52Rows[0]);
});

// RF-4-4
test("RF-4-4 : ne contient pas RF C73 R01 A7353", () => {
    const AMOUNT = 43;
    const AGGREGATED_ROW_ID = 'RF-4-4';

    const m52Rows = [
        new M52RowRecord({
            'Dépense/Recette': 'R',
            'Investissement/Fonctionnement': 'F',
            'Réel/Ordre id/Ordre diff': 'OR',
            'Rubrique fonctionnelle': 'R01',
            'Article': 'A7353',
            'Chapitre': 'C73',
            'Montant': AMOUNT
        })
    ];

    const instruction = new M52Instruction({ rows: new ImmutableSet(m52Rows) });

    const aggVision = m52ToAggregated(instruction);

    const aggRow = aggVision.find(row => row.id === AGGREGATED_ROW_ID);

    expect(aggRow.M52Rows.size).toBe(0);
});


// RF-6-1
test("RF-6-1 : contient RF C017 R567 A75342 et RF C017 R567 A75343", () => {
    const AMOUNT = 45;
    const AGGREGATED_ROW_ID = 'RF-6-1';

    const m52Rows = [
        new M52RowRecord({
            'Dépense/Recette': 'R',
            'Investissement/Fonctionnement': 'F',
            'Réel/Ordre id/Ordre diff': 'OR',
            'Rubrique fonctionnelle': 'R567',
            'Article': 'A75342',
            'Chapitre': 'C017',
            'Montant': AMOUNT
        }),
        new M52RowRecord({
            'Dépense/Recette': 'R',
            'Investissement/Fonctionnement': 'F',
            'Réel/Ordre id/Ordre diff': 'OR',
            'Rubrique fonctionnelle': 'R567',
            'Article': 'A75343',
            'Chapitre': 'C017',
            'Montant': AMOUNT
        })
    ];

    const instruction = new M52Instruction({ rows: new ImmutableSet(m52Rows) });

    const aggVision = m52ToAggregated(instruction);

    const aggRow = aggVision.find(row => row.id === AGGREGATED_ROW_ID);

    expect(aggRow.M52Rows.size).toBe(2);
    expect(aggRow.M52Rows.has(m52Rows[0])).toBe(true);
    expect(aggRow.M52Rows.has(m52Rows[1])).toBe(true);
});



// RF-9-2
test("RF-9-2 : contient RF C78 R0202 A7875", () => {
    const AMOUNT = 40;
    const AGGREGATED_ROW_ID = 'RF-9-2';

    const m52Rows = [
        new M52RowRecord({
            'Dépense/Recette': 'R',
            'Investissement/Fonctionnement': 'F',
            'Réel/Ordre id/Ordre diff': 'OR',
            'Rubrique fonctionnelle': 'R0202',
            'Article': 'A7875',
            'Chapitre': 'C78',
            'Montant': AMOUNT
        })
    ];

    const instruction = new M52Instruction({ rows: new ImmutableSet(m52Rows) });

    const aggVision = m52ToAggregated(instruction);

    const aggDF37 = aggVision.find(row => row.id === AGGREGATED_ROW_ID);

    expect(aggDF37.M52Rows.size).toBe(1);
});

test("RF-9-2 : ne contient pas RF C017 R567 A7788", () => {
    const AMOUNT = 44;
    const AGGREGATED_ROW_ID = 'RF-9-2';

    const m52Rows = [
        new M52RowRecord({
            'Dépense/Recette': 'R',
            'Investissement/Fonctionnement': 'F',
            'Réel/Ordre id/Ordre diff': 'OR',
            'Rubrique fonctionnelle': 'R567',
            'Article': 'A7788',
            'Chapitre': 'C017',
            'Montant': AMOUNT
        })
    ];

    const instruction = new M52Instruction({ rows: new ImmutableSet(m52Rows) });

    const aggVision = m52ToAggregated(instruction);

    const aggRow = aggVision.find(row => row.id === AGGREGATED_ROW_ID);

    expect(aggRow.M52Rows.first()).toBe(undefined);
});


// RF-9-7
test("RF-9-7 : ne contient pas l'article A7513", () => {
    const AMOUNT = 42;
    const AGGREGATED_ROW_ID = 'RF-9-7';

    const m52Rows = [
        new M52RowRecord({
            'Dépense/Recette': 'R',
            'Investissement/Fonctionnement': 'F',
            'Réel/Ordre id/Ordre diff': 'OR',
            'Rubrique fonctionnelle': 'RXXX',
            'Article': 'A7513',
            'Chapitre': 'CXX',
            'Montant': AMOUNT
        })
    ];

    const instruction = new M52Instruction({ rows: new ImmutableSet(m52Rows) });

    const aggVision = m52ToAggregated(instruction);

    const aggDF37 = aggVision.find(row => row.id === AGGREGATED_ROW_ID);

    expect(aggDF37.M52Rows.size).toBe(0);
});

test("RF-9-7 : ne contient pas RF C017 R567 A75342 et RF C017 R567 A75343", () => {
    const AMOUNT = 45;
    const AGGREGATED_ROW_ID = 'RF-9-7';

    const m52Rows = [
        new M52RowRecord({
            'Dépense/Recette': 'R',
            'Investissement/Fonctionnement': 'F',
            'Réel/Ordre id/Ordre diff': 'OR',
            'Rubrique fonctionnelle': 'R567',
            'Article': 'A75342',
            'Chapitre': 'C017',
            'Montant': AMOUNT
        }),
        new M52RowRecord({
            'Dépense/Recette': 'R',
            'Investissement/Fonctionnement': 'F',
            'Réel/Ordre id/Ordre diff': 'OR',
            'Rubrique fonctionnelle': 'R567',
            'Article': 'A75343',
            'Chapitre': 'C017',
            'Montant': AMOUNT
        })
    ];

    const instruction = new M52Instruction({ rows: new ImmutableSet(m52Rows) });

    const aggVision = m52ToAggregated(instruction);

    const aggRow = aggVision.find(row => row.id === AGGREGATED_ROW_ID);

    expect(aggRow.M52Rows.size).toBe(0);
});



/**
 * DF - Dépenses de Fonctionnement 
 * 
 */

test("DF-3-6 : ne contient pas d'article commençant par A657 des fonctions 4, 5 et 8", () => {
    const AMOUNT = 38;
    const AGGREGATED_ROW_ID = 'DF-3-6';

    const m52Rows = [
        new M52RowRecord({
            'Dépense/Recette': 'D',
            'Investissement/Fonctionnement': 'F',
            'Réel/Ordre id/Ordre diff': 'OR',
            'Rubrique fonctionnelle': 'R4',
            'Article': 'A65711',
            'Montant': AMOUNT
        }),
        new M52RowRecord({
            'Dépense/Recette': 'D',
            'Investissement/Fonctionnement': 'F',
            'Réel/Ordre id/Ordre diff': 'OR',
            'Rubrique fonctionnelle': 'R5',
            'Article': 'A65722',
            'Montant': AMOUNT
        }),
        new M52RowRecord({
            'Dépense/Recette': 'D',
            'Investissement/Fonctionnement': 'F',
            'Réel/Ordre id/Ordre diff': 'OR',
            'Rubrique fonctionnelle': 'R8',
            'Article': 'A65733',
            'Montant': AMOUNT
        })
    ];

    const instruction = new M52Instruction({ rows: new ImmutableSet(m52Rows) });

    const aggVision = m52ToAggregated(instruction);

    const aggDF37 = aggVision.find(row => row.id === AGGREGATED_ROW_ID);

    expect(aggDF37.M52Rows.size).toBe(0);
});

test("DF-3-6 : contient DF C65 R311 A6574", () => {
    const AMOUNT = 39;
    const AGGREGATED_ROW_ID = 'DF-3-6';

    const m52Rows = [
        new M52RowRecord({
            'Dépense/Recette': 'D',
            'Investissement/Fonctionnement': 'F',
            'Réel/Ordre id/Ordre diff': 'OR',
            'Rubrique fonctionnelle': 'R311',
            'Article': 'A6574',
            'Chapitre': 'C65',
            'Montant': AMOUNT
        })
    ];

    const instruction = new M52Instruction({ rows: new ImmutableSet(m52Rows) });

    const aggVision = m52ToAggregated(instruction);

    const aggDF37 = aggVision.find(row => row.id === AGGREGATED_ROW_ID);

    expect(aggDF37.M52Rows.first()).toBe(m52Rows[0]);
});


test("DF-5 : contient DF C014 R01 A73913/A73914/A73926/A739261/A739262", () => {
    const AGGREGATED_ROW_ID = 'DF-5';

    const m52Rows = [
        new M52RowRecord({
            'Dépense/Recette': 'D',
            'Investissement/Fonctionnement': 'F',
            'Réel/Ordre id/Ordre diff': 'OR',
            'Rubrique fonctionnelle': 'R01',
            'Article': 'A73913',
            'Chapitre': 'C014',
            'Montant': 1
        }),
        new M52RowRecord({
            'Dépense/Recette': 'D',
            'Investissement/Fonctionnement': 'F',
            'Réel/Ordre id/Ordre diff': 'OR',
            'Rubrique fonctionnelle': 'R01',
            'Article': 'A73914',
            'Chapitre': 'C014',
            'Montant': 2
        }),
        new M52RowRecord({
            'Dépense/Recette': 'D',
            'Investissement/Fonctionnement': 'F',
            'Réel/Ordre id/Ordre diff': 'OR',
            'Rubrique fonctionnelle': 'R01',
            'Article': 'A73926',
            'Chapitre': 'C014',
            'Montant': 3
        }),
        new M52RowRecord({
            'Dépense/Recette': 'D',
            'Investissement/Fonctionnement': 'F',
            'Réel/Ordre id/Ordre diff': 'OR',
            'Rubrique fonctionnelle': 'R01',
            'Article': 'A739261',
            'Chapitre': 'C014',
            'Montant': 4
        }),
        new M52RowRecord({
            'Dépense/Recette': 'D',
            'Investissement/Fonctionnement': 'F',
            'Réel/Ordre id/Ordre diff': 'OR',
            'Rubrique fonctionnelle': 'R01',
            'Article': 'A739262',
            'Chapitre': 'C014',
            'Montant': 5
        })
    ];

    const instruction = new M52Instruction({ rows: new ImmutableSet(m52Rows) });

    const aggVision = m52ToAggregated(instruction);

    const aggDF5 = aggVision.find(row => row.id === AGGREGATED_ROW_ID);

    expect(aggDF5.M52Rows.includes(m52Rows[0])).toBe(true);
    expect(aggDF5.M52Rows.includes(m52Rows[1])).toBe(true);
    expect(aggDF5.M52Rows.includes(m52Rows[2])).toBe(true);
    expect(aggDF5.M52Rows.includes(m52Rows[3])).toBe(true);
    expect(aggDF5.M52Rows.includes(m52Rows[4])).toBe(true);
});