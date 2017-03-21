import { Map as ImmutableMap } from 'immutable';

import { EXPENDITURES, REVENUE } from './constants/pages';
import budgetBalance from '../../shared/js/finance/budgetBalance';
import m52ToAggregated from '../../shared/js/finance/m52ToAggregated';
import hierarchicalAggregated from '../../shared/js/finance/hierarchicalAggregated';
import {flattenTree} from '../../shared/js/finance/visitHierarchical.js';
import navigationTree from './navigationTree';


/*

interface FinanceElementProps{
    contentId: string,
    total: number, // total amount of money for this element
    texts: FinanceElementTextsRecord,

    // the partition will be displayed in the order it's passed. Sort beforehand if necessary
    partition: Array<{
        contentId: string,
        amount: number,
        texts: FinanceElementTextsRecord
    }>
}

 */
function makePartition(contentId, totalById, textsById){
    const childrenIds = navigationTree[contentId];

    return childrenIds ? childrenIds.map(childId => ({
        contentId: childId,
        amount: totalById.get(childId),
        texts: textsById.get(childId)
    })) : undefined;
}


function getTotalById(m52Instruction){
    const aggregated = m52ToAggregated(m52Instruction);

    let totalById = new ImmutableMap();

    aggregated.forEach(aggRow => {
        totalById = totalById.set(aggRow.id, aggRow.total);
    });

    ['D', 'R'].forEach(rd => {
        ['F', 'I'].forEach(fi => {
            const hierAgg = hierarchicalAggregated(aggregated, {rd, fi});
            flattenTree(hierAgg).forEach(aggHierNode => {
                totalById = totalById.set(aggHierNode.id, aggHierNode.total);
            });
        });
    });

    return totalById;
}

export default function (state) {
    const { m52Instruction, breadcrumb, textsById } = state;

    const balance = m52Instruction ? budgetBalance(m52Instruction) : {};
    const displayedContentId = breadcrumb.last();

    const totalById = (m52Instruction && getTotalById(m52Instruction)) || new ImmutableMap();

    const total = m52Instruction && (displayedContentId === EXPENDITURES ?
        balance.expenditures : (displayedContentId === REVENUE ?
            balance.revenue :
            totalById.get(displayedContentId)));
    
    return Object.assign(
        {
            breadcrumb,
            displayedContentId,
            textsById,
            total, 
            texts: textsById.get(displayedContentId),
            partition: makePartition(displayedContentId, totalById, textsById)
        },
        balance
    );
}