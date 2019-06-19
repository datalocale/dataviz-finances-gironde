import { Record } from 'immutable';
import { markdown as md } from '../../shared/js/components/Markdown';

import {
    FINANCE_DETAIL_ID_CHANGE, FINANCE_DATA_RECEIVED, PLAN_DE_COMPTE_RECEIVED,
    ATEMPORAL_TEXTS_RECEIVED, TEMPORAL_TEXTS_RECEIVED,
    CHANGE_EXPLORATION_YEAR
} from './constants/actions';

const FinanceElementTextsRecord = Record({
    label: undefined,
    atemporal: undefined,
    temporal: undefined
});


export default function reducer(state, action) {
    const {type} = action;

    switch (type) {
        case FINANCE_DATA_RECEIVED:{
            const {documentBudgetaires, aggregations} = action;

            let newState = state;

            for(const db of documentBudgetaires){
                newState = newState.setIn(['docBudgByYear', db.Exer], db);
            }
            for(const {year, aggregation} of aggregations){
                newState = newState.setIn(['aggregationByYear', year], aggregation);
            }

            const maxYear = Math.max(...documentBudgetaires.map(db => db.Exer))

            newState = newState.set('currentYear', maxYear).set('explorationYear', maxYear)

            return newState
        }
        case PLAN_DE_COMPTE_RECEIVED: {
            const {planDeCompte} = action;
            return state = state.setIn(['planDeCompteByYear', planDeCompte.Exer], planDeCompte);
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
