import { createStore } from 'redux';

function reducer(state, action){
    return state;
}

fetch('./data/cedi_2015_CA.csv')
.then(resp => resp.text())
.then(body => console.log('body', body.slice(0, 1000)))

// fetch the CA.
// make immutable data out of it
// redux all this
// make a sunburst component

const store = createStore(reducer);