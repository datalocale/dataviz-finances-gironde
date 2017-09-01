'use strict';

var path = require('path');

/*
    This file defines a Sass importer that exports a single "env-vars" module 
    containing env-sensitive variable values
*/
const PROD = 'production';  // gironde.fr website integration
const DEMO = 'demo';        // gh-pages demo
const DEV = 'development';  // localhost

const byEnv = {
    "home-illustration-url": {
        [PROD]: '/sites/default/files/2017-07/map-optimised.jpg',
        [DEMO]: '../images/map-optimised.jpg',
        [DEV]: '../images/map-optimised.jpg'
    }
}

function makeFileContent(vars){
    return Object.keys(vars)
    .map(varName => ['$', varName,' : ', vars[varName], ';'].join(''))
    .join('\n');
}

function makeVariableObject(env){
    const o = {};

    Object.keys(byEnv).forEach(k => {
        const val = byEnv[k][env];
        if(typeof val === 'string'){
            o[k] = `"${val}"`;
            return;
        }

        o[k] = val;
    })

    return o;
}

module.exports = function(file, prev){

    if(file === 'env-vars'){
        console.log('IMPORTER env', process.env.NODE_ENV);

        return {
            contents: makeFileContent(makeVariableObject(process.env.NODE_ENV))
        }
    }
    else{
        return {
            file: path.join(path.dirname(prev), file + (path.extname(file) ? '' : '.scss'))
        }
    }
}