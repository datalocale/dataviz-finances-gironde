import budgetBalance from '../../shared/js/finance/budgetBalance';

export default function(state){
    const { m52Instruction } = state;

    return m52Instruction ? budgetBalance(m52Instruction) : {};
}