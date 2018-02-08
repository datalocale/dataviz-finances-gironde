import { Record } from 'immutable';
import { markdown as md } from '../../shared/js/components/Markdown';
import { hierarchicalM52, hierarchicalAggregated, m52ToAggregated } from '../../shared/js/finance/memoized';

import {
    FINANCE_DETAIL_ID_CHANGE, DOCUMENTS_BUDGETAIRES_RECEIVED, CORRECTION_AGGREGATION_RECEIVED,
    ATEMPORAL_TEXTS_RECEIVED, TEMPORAL_TEXTS_RECEIVED,
    CHANGE_EXPLORATION_YEAR
} from './constants/actions';
import { DF, DI } from './constants/pages';

const FinanceElementTextsRecord = Record({
    label: undefined,
    atemporal: undefined,
    temporal: undefined
});


export default function reducer(state, action) {
    const {type} = action;

    switch (type) {
        case DOCUMENTS_BUDGETAIRES_RECEIVED:{
            const {docBudgs} = action;
            const {corrections} = state;

            if(corrections){
                // these variables will be unused. These calls exist for the sole purpose of memoization as
                // soon as the data arrives
                docBudgs.forEach(db => {
                    const aggregated = m52ToAggregated(db, corrections);
                    const hierAgg = hierarchicalAggregated(aggregated);
                    const hierarchicalM52DF = hierarchicalM52(db, DF);
                    const hierarchicalM52DI = hierarchicalM52(db, DI);
                    
                    // to prevent minifier optimizations
                    console.log('memz', hierarchicalM52DI, hierarchicalM52DF, hierAgg);
                })
            }

            let newState = state;

            docBudgs.forEach(db => {
                newState = newState.setIn(['docBudgByYear', db.Exer], db);
            })

            return newState
        }
        case CORRECTION_AGGREGATION_RECEIVED: {
            const {corrections} = action;
            return state.set('corrections', corrections);
        }
        case FINANCE_DETAIL_ID_CHANGE:
            return state.set('financeDetailId', action.financeDetailId);
        case ATEMPORAL_TEXTS_RECEIVED: {
            let textMap = state.get('textsById');

            action.textList.forEach(({id, label = '', description = ''}) => {
                // sometimes, humans leave a space somewhere
                id = id.trim();

                const financeElementTexts = textMap
                    .get(id, new FinanceElementTextsRecord())
                    .set('atemporal', md.render(description))
                    .set('label', label.trim());
                textMap = textMap.set(id, financeElementTexts);
            });

            return state.set('textsById', textMap);
        }
        case TEMPORAL_TEXTS_RECEIVED: {
            let textMap = state.get('textsById');

            action.textList.forEach(({id, text = ''}) => {
                // sometimes, humans leave a space somewhere
                id = id.trim();

                const financeElementTexts = textMap
                    .get(id, new FinanceElementTextsRecord())
                    .set('temporal', md.render(text));
                textMap = textMap.set(id, financeElementTexts);
            });

            return state.set('textsById', textMap);
        }
        case CHANGE_EXPLORATION_YEAR: {
            const {year} = action;
            return state.set('explorationYear', year);
        }
        default:
            console.warn('Unhandled action type', type);
            return state;
    }
}
