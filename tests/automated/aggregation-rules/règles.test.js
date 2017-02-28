import * as matchers from 'jest-immutable-matchers';
import { OrderedSet as ImmutableSet } from 'immutable';
import { rules, default as m52ToAggregated } from '../../../client/js/finance/m52ToAggregated';
import { M52RowRecord, M52Instruction } from '../../../client/js/finance/M52InstructionDataStructures';

const AGGREGATED_ROWS_COUNT = Object.keys(rules).length;

jest.addMatchers(matchers);


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

    const aggRF11 = aggVision.filter(row => row.id === AGGREGATED_ROW_ID).first();
    const otherAggRows = aggVision.delete(aggRF11);

    expect(aggRF11.id).toEqual(AGGREGATED_ROW_ID);
    expect(aggRF11.M52Rows).toBeImmutableSet();
    expect(aggRF11.M52Rows.first()).toBe(m52Row);
    expect(aggRF11["Montant"]).toBe(AMOUNT);

    otherAggRows.every(r => {
        expect(r["Montant"]).toBe(0);
    });

});