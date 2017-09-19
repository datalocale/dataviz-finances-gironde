import { Record } from 'immutable';
import { markdown as md } from '../../shared/js/components/Markdown';

import {
    FINANCE_DETAIL_ID_CHANGE, M52_INSTRUCTION_RECEIVED,
    ATEMPORAL_TEXTS_RECEIVED, TEMPORAL_TEXTS_RECEIVED, LABELS_RECEIVED,
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
        case M52_INSTRUCTION_RECEIVED:{
            const {m52Instruction} = action
            return state.setIn(['m52InstructionByYear', m52Instruction.year], m52Instruction);
        }
        case FINANCE_DETAIL_ID_CHANGE:
            return state.set('financeDetailId', action.financeDetailId);
        case ATEMPORAL_TEXTS_RECEIVED: {
            let textMap = state.get('textsById');

            action.textList.forEach(({id, label, description = ''}) => {
                const financeElementTexts = textMap
                    .get(id, new FinanceElementTextsRecord())
                    .set('atemporal', md.render(description))
                    .set('label', label);
                textMap = textMap.set(id, financeElementTexts);
            });

            return state.set('textsById', textMap);
        }
        case TEMPORAL_TEXTS_RECEIVED: {
            let textMap = state.get('textsById');

            action.textList.forEach(({id, text = ''}) => {
                const financeElementTexts = textMap
                    .get(id, new FinanceElementTextsRecord())
                    .set('temporal', md.render(text));
                textMap = textMap.set(id, financeElementTexts);
            });

            return state.set('textsById', textMap);
        }
        case LABELS_RECEIVED: {
            let textMap = state.get('textsById');

            action.labelList.forEach(({id, text = ''}) => {
                const financeElementTexts = textMap
                    .get(id, new FinanceElementTextsRecord())
                    .set('label', text);
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
