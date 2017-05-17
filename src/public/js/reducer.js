import { Record, Map as ImmutableMap } from 'immutable';
import _md from 'markdown-it';

import { 
    FINANCE_DETAIL_ID_CHANGE, M52_INSTRUCTION_RECEIVED, 
    ATEMPORAL_TEXTS_RECEIVED, YEAR_TEXTS_RECEIVED, LABELS_RECEIVED
} from './constants/actions';

const FinanceElementTextsRecord = Record({
    label: undefined,
    atemporal: undefined,
    // ImmutableMap<year, string>
    byYear: undefined
});

const md = _md({
    html: true,
    xhtmlOut: false,
    breaks: false,
    langPrefix: 'language-',
    linkify: true,
    typographer: false,
    quotes: '“”‘’',
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
        case YEAR_TEXTS_RECEIVED: {
            const year = action.year;
            let textMap = state.get('textsById');

            action.textList.forEach(({id, text = ''}) => {
                let financeElementTexts = textMap.get(id, new FinanceElementTextsRecord());
                let byYear = financeElementTexts.get(year, new ImmutableMap()).set(year, md.render(text));

                textMap = textMap.set(id, financeElementTexts.set('byYear', byYear));
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
        default:
            console.warn('Unknown action type', type);
            return state;
    }
}