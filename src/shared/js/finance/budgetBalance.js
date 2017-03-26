import {isRF, isRI, isDF, isDI, isOR} from './rowFilters';
import {RF, RI, DF, DI} from './constants';


export default function(m52Instruction){
    const budget = {};
    [RF, RI, DF, DI].forEach(k => budget[k] = 0);

    m52Instruction.rows.forEach(row => {
        if(isOR(row)){
            if(isRF(row)){
                budget[RF] += row['Montant'];
                return;
            }
            if(isRI(row)){
                budget[RI] += row['Montant'];
                return;
            }
            if(isDF(row)){
                budget[DF] += row['Montant'];
                return;
            }
            if(isDI(row)){
                budget[DI] += row['Montant'];
                return;
            }
        }
    });

    budget.expenditures = budget[DI] + budget[DF];
    budget.revenue = budget[RI] + budget[RF];

    return Object.freeze(budget);
}