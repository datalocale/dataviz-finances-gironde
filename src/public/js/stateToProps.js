import budgetBalance from '../../shared/js/finance/budgetBalance';

export default function (state) {
    const { m52Instruction, breadcrumb } = state;

    return Object.assign(
        { breadcrumb },
        m52Instruction ? budgetBalance(m52Instruction) : {}
    );
}