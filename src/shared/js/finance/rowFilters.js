
export function isR(row){
    return row['CodRD'] === 'R';
}

export function isD(row){
    return row['CodRD'] === 'D';
}

export function isF(row){
    return row['FI'] === 'F';
}

export function isI(row){
    return row['FI'] === 'I';
}



export function isRF(row){
    return isR(row) && isF(row);
}
export function isDF(row){
    return isD(row) && isF(row);
}
export function isRI(row){
    return isR(row) && isI(row);
}
export function isDI(row){
    return isD(row) && isI(row);
}