import React from 'react';

const DELAY = 500;

export default class SektorComponent extends React.Component {

    constructor(){
        super();
        this._elements = [];
    }

    _animate(angle1, angle2, radius, initialDelay){
        return new Promise(resolve => {
            setTimeout(resolve, initialDelay);
        })
        .then(() => {
            return moveToAngle(this._sector1, angle1, radius, DELAY);
        })
        .then(() => {
            return moveToAngle(this._sector2, angle2, radius, DELAY);
        })
        
    }

    _reset(){
        //changeAngle(this._sector1);
        //changeAngle(this._sector2);
    }

    componentDidMount(){
        const {proportion1, proportion2, radius} = this.props;
        //this._animate(2*Math.PI*proportion1, 2*Math.PI*proportion2, radius, 2000);
    }

    componentDidUpdate() {
        const {proportion1, proportion2, radius} = this.props;
        //this._reset(radius);
        //this._animate(2*Math.PI*proportion1, 2*Math.PI*proportion2, radius, 500);
    } 

    shouldComponentUpdate(newProps){
        const c1 = this.props.contextElements;
        const c2 = newProps.contextElements;

        return c1.length === 0 || c2.length === 0 || c1[c1.length-1].label !== c2[c2.length-1].label;
    }

    render() {
        const { contextElements } = this.props;

        return React.createElement('div', { className: 'finance-element-context' },
            contextElements.map(({id, url, proportion, colorClass, label}) => {
                return React.createElement(url ? 'a' : 'span', 
                    {
                        key: id,
                        href: url,
                        ref: el => this._elements.push(el)
                    }, 
                    React.createElement('div', 
                        {
                            className: colorClass,
                            style: {
                                width: proportion*100+'%'
                            },
                        },
                        proportion >= 0.5 ? React.createElement('span', {className: 'text'}, label)  : undefined
                    ),
                    proportion < 0.5 ? React.createElement('span', {className: 'text'}, label) : undefined
                )
            })
        )
    }
}
