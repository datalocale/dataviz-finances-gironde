import budgetBalance from '../../shared/js/finance/budgetBalance';


export default function (state) {
    const { m52Instruction, breadcrumb, textsById } = state;

    const displayedElement = breadcrumb.last();

    

    return Object.assign(
        { breadcrumb, textsById },
        m52Instruction ? budgetBalance(m52Instruction) : {}
    );
}