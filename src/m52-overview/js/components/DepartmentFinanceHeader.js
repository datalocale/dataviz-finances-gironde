import {createElement as θ} from 'react';

/*
        {
            LibelleColl: documentBudgetaire.LibelleColl,
            Exer: documentBudgetaire.Exer,
            NatDec: documentBudgetaire.NatDec
        }

 */

export default function({LibelleColl, Exer, NatDec, children}){

    return θ('header', {className: 'departement-finance'},
        θ('h1', {}, 'Instruction M52 et vision agrégée'),
        θ('div', {},
            θ('h2', {}, 
                LibelleColl,
                ' - ',
                NatDec,
                ' - ',
                Exer
            ),
            children
        )
    );
}
