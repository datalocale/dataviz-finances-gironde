export default function reducer(state, action){
    const {type} = action;

    switch(type){
    case 'M52_INSTRUCTION_RECEIVED':
        return state.set('M52Instruction', action.m52Instruction);
    default:
        console.warn('Unknown action type', type);
        return state;
    }
}