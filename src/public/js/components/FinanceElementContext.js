import React from 'react';

const DELAY = 500;


function animate(elements, widths){
    elements.forEach((e, i) => {
        e.style.width = widths[i];
    })
}

function reset(els){
    els.forEach(e => e.style.width = 0);
}



export default class SektorComponent extends React.Component {

    constructor(){
        super();
        this._elements = [];
    }


    /*_reset(){
        this._elements.forEach(e => {
            e.style.width = 0;
        })
        this._elements = [];
    }*/

    componentDidMount(){
        setTimeout(() => {
            animate(
                Array.from(this._container.children).map(c => c.querySelector('div')), 
                this.props.contextElements.map(c => `${c.proportion*100}%`)
            );
        }, 500)
    }

    componentDidUpdate() {
        console.log('els', this._container)

        reset(
            Array.from(this._container.children).map(c => c.querySelector('div'))
        )
        
        setTimeout(() => {
            animate(
                Array.from(this._container.children).map(c => c.querySelector('div')), 
                this.props.contextElements.map(c => `${c.proportion*100}%`)
            );
        }, 500)
    } 

    shouldComponentUpdate(newProps){
        const c1 = this.props.contextElements;
        const c2 = newProps.contextElements;

        return c1.length === 0 || c2.length === 0 || c1[c1.length-1].label !== c2[c2.length-1].label;
    }

    render() {
        const { contextElements } = this.props;

        return React.createElement('div', { className: 'finance-element-context', ref: el => this._container = el },
            contextElements.map(({id, url, proportion, colorClass, label}) => {
                return React.createElement(url ? 'a' : 'span', 
                    {
                        key: id,
                        href: url
                    }, 
                    React.createElement('div', 
                        {
                            className: colorClass
                        },
                        proportion >= 0.5 ? React.createElement('span', {className: 'text'}, label)  : undefined
                    ),
                    proportion < 0.5 ? React.createElement('span', {className: 'text'}, label) : undefined
                )
            })
        )
    }
}
