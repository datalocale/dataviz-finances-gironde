import React from 'react';

/* 
    Freely adapted from https://github.com/Stanko/sektor/blob/gh-pages/js/sektor.es6.js (MIT licence)
*/

function makeArcD(angle, radius) {
    const x = radius + radius * Math.cos(angle);
    const y = radius + radius * Math.sin(angle);

    return `A${radius},${radius} 1 0 1 ${x},${y}`
}

function makeSectorD(angle, radius) {
    // Arc angles
    const firstAngle = angle > Math.PI ? Math.PI/2 : angle - Math.PI/2;
    const secondAngle = angle - 5*Math.PI/2;

    // Arcs
    const firstArc = makeArcD(firstAngle, radius);
    const secondArc = angle > Math.PI ? makeArcD(secondAngle, radius) : '';

    // start -> starting line
    // end -> will path be closed or not
    const end = 'z';
    const start = `M${radius},${radius} L${radius},0`;

    return `${start} ${firstArc} ${secondArc} ${end}`;
}

function changeAngle(el, angle, radius){
    el.setAttribute('d', makeSectorD(angle, radius)); 
}

function moveToAngle(el, angle, radius, delay){
    return new Promise(resolve => {
        const start = performance.now();

        (function step(){
            requestAnimationFrame(now => {
                const elapsed = now - start;
                let fraction = elapsed/delay;
                if(fraction >= 1)
                    fraction = 1;

                changeAngle(el, angle*fraction, radius);

                if(fraction >= 1){
                    resolve()
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

    _reset(radius){
        changeAngle(this._sector1, 0, radius);
        changeAngle(this._sector2, 0, radius);
    }

    componentDidMount(){
        const {proportion1, proportion2, radius} = this.props;
        this._animate(2*Math.PI*proportion1, 2*Math.PI*proportion2, radius, 2000);
    }

    componentDidUpdate() {
        const {proportion1, proportion2, radius} = this.props;
        this._reset(radius);
        this._animate(2*Math.PI*proportion1, 2*Math.PI*proportion2, radius, 500);
    } 

    shouldComponentUpdate(newProps){
        return this.props.parent.id !== newProps.parent.id;
    }

    render() {
        const { radius } = this.props;
        return React.createElement('svg', { width: 2*radius, height: 2*radius },
            React.createElement('circle', { fill: '#AAA', cx: radius, cy: radius, r: radius }),
            React.createElement('path', { fill: '#F98361', ref: el => this._sector1 = el }),
            React.createElement('path', { fill: '#EC3500', ref: el => this._sector2 = el })
        );
    }
}
