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

                //console.log('amountToDisplay', amountToDisplay, amount, fraction)

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

    _animate(amount){
        return this._readyP
        .then(() => {
            return roll(this._el, amount, DELAY);
        })
    }

    _reset(){
        this._el.textContent = '- €';
    }

    componentDidMount(){
        const { amount } = this.props;

        this._readyP = new Promise(resolve => { setTimeout(resolve, 1500); })
        this._animate(amount);
    }

    componentWillUnmount(){
        this._readyP = undefined;
    }

    componentDidUpdate() {
        const { amount } = this.props;
        this._reset();
        this._animate(amount);
    } 

    shouldComponentUpdate(newProps){
        return this.props.amount !== newProps.amount;
    }

    render() {
        return React.createElement('span', { ref: el => this._el = el }, '- €');
    }
}
