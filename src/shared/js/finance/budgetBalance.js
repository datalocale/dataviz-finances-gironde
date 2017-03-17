import {isR, isD, isOR} from './rowFilters';

export default function(m52Instruction){
    let expenditures = 0;
    let revenue = 0;

    m52Instruction.rows.forEach(row => {
        if(isOR(row)){
            if(isR(row)){
                revenue += row['Montant'];
            }
            if(isD(row)){
                expenditures += row['Montant'];
            }
        }
    });

    return { expenditures, revenue };
}