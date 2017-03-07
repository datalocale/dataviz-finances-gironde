import { Record } from 'immutable';
import _md from 'markdown-it';

import { BREADCRUMB_CHANGE, M52_INSTRUCTION_RECEIVED, ATEMPORAL_TEXTS_RECEIVED } from './constants/actions';

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
        case M52_INSTRUCTION_RECEIVED:
            return state.set('m52Instruction', action.m52Instruction);
        case BREADCRUMB_CHANGE:
            return state.set('breadcrumb', action.breadcrumb);
        case ATEMPORAL_TEXTS_RECEIVED: {
            let textMap = state.get('textsById');

            action.textList.forEach(({id, text}) => {
                const financeElementTexts = textMap
                    .get(id, new FinanceElementTextsRecord())
                    .set('atemporal', md.render(text));
                textMap = textMap.set(id, financeElementTexts);
            });

            return state.set('textsById', textMap);
        }
        default:
            console.warn('Unknown action type', type);
            return state;
    }
}