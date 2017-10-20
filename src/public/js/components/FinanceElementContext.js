import React from 'react';

const DELAY = 500;

export default class SektorComponent extends React.Component {

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
        return this.props.label !== newProps.label;
    }

    render() {
        const { label, top, parent, colorClass1, colorClass2, backgroundColorClass, proportion1, proportion2 } = this.props;

        return React.createElement('div', { className: 'finance-element-context' },
            React.createElement('a', { className: backgroundColorClass, href: top.url },
                React.createElement('span', {className: 'text'}, top.label)
            ),
            parent && top ? React.createElement('a', 
                { 
                    href: parent.url,
                    ref: el => this._context1 = el 
                }, 
                React.createElement('div', 
                    {
                        className: colorClass1,
                        style: {
                            width: proportion1*100+'%'
                        },
                    },
                    proportion1 >= 0.5 ? React.createElement('span', {className: 'text'},  parent.label)  : undefined
                ),
                proportion1 < 0.5 ? React.createElement('span', {className: 'text'}, parent.label) : undefined
            ) : undefined,
            React.createElement('div', 
                { 
                    ref: el => this._context2 = el,
                }, 
                React.createElement('div', 
                    {
                        className: colorClass2,
                        style: {
                            width: proportion2*100+'%'
                        },
                    },
                    proportion2 >= 0.5 ? React.createElement('span', {className: 'text'},  label)  : undefined
                ),
                proportion2 < 0.5 ? React.createElement('span', {className: 'text'}, label) : undefined
            )
        )
    }
}
