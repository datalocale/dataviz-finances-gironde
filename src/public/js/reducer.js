import { BREADCRUMB_CHANGE, M52_INSTRUCTION_RECEIVED } from './constants/actions';

export default function reducer(state, action) {
    const {type} = action;

    switch (type) {
        case M52_INSTRUCTION_RECEIVED:
            return state.set('m52Instruction', action.m52Instruction);
        case BREADCRUMB_CHANGE:
            return state.set('breadcrumb', action.breadcrumb);
        default:
            console.warn('Unknown action type', type);
            return state;
    }
}