import React from 'react';

const MILLION = 1000000;

export function makeAmountString(amount){
    return (
        amount < 100000 ?
    `${(amount).toFixed(0)}€` :
    `${(amount/MILLION).toFixed(1)} M€`
    )
    .replace('.', ',');
}

export default ({amount}) => {
    return React.createElement('span', {className: 'money-amount'}, makeAmountString(amount));
};
