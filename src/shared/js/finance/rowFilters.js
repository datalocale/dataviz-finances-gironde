export function isOR(m52Row){
    return m52Row['Réel/Ordre id/Ordre diff'] === 'OR';
}

export function isR(m52Row){
    return m52Row['Dépense/Recette'] === 'R';
}

export function isD(m52Row){
    return m52Row['Dépense/Recette'] === 'D';
}

export function isF(m52Row){
    return m52Row['Investissement/Fonctionnement'] === 'F';
}

export function isI(m52Row){
    return m52Row['Investissement/Fonctionnement'] === 'I';
}



export function isRF(m52Row){
    return isR(m52Row) && isF(m52Row);
}
export function isDF(m52Row){
    return isD(m52Row) && isF(m52Row);
}
export function isRI(m52Row){
    return isR(m52Row) && isI(m52Row);
}
export function isDI(m52Row){
    return isD(m52Row) && isI(m52Row);
}