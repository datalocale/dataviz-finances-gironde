import React from 'react';
import { makeAmountString } from '../../../shared/js/components/MoneyAmount';

function roll(el, amount, delay){
    return new Promise(resolve => {
        const start = performance.now();

        (function step(){
            requestAnimationFrame(now => {
                const elapsed = now - start;
                let fraction = elapsed/delay;
                if(fraction >= 1)
                    fraction = 1;

                // ease out expo to stabilize the significative numbers quickly
                const amountToDisplay = amount * (1 - (fraction === 1 ? 0 : Math.pow( 2, -10*fraction)));

                el.textContent = makeAmountString(amountToDisplay);

                if(fraction >= 1){
                    resolve();
                }
                else{
                    step();
                }
            })
        })();
    })
}

const DELAY = 500;

export default class SektorComponent extends React.Component {

    _animate(amount, initialDelay){
        return new Promise(resolve => {
            setTimeout(resolve, initialDelay);
        })
        .then(() => {
            return roll(this._el, amount, DELAY);
        })
        
    }

    _reset(){
        this._el.textContent = ' ';
    }

    componentDidMount(){
        const { amount } = this.props;
        this._animate(amount, 2000);
    }

    componentDidUpdate() {
        const { amount } = this.props;
        this._reset();
        this._animate(amount, 500);
    } 

    shouldComponentUpdate(newProps){
        return this.props.amount !== newProps.amount;
    }

    render() {
        return React.createElement('span', { ref: el => this._el = el }, ' ');
    }
}
