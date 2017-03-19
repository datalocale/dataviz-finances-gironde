import { EXPENDITURES, REVENUE, DF, RF, DI, RI } from './constants/pages';

/*
    This file is mostly a json file, but some parts are generated for easier maintenance reasons
 */

const exp = {};

exp[EXPENDITURES] = [ DF, DI ];
exp[REVENUE] = [ RF, RI ];

exp[DF] = ['DF-2', 'DF-3', 'DF-4', 'DF-5', 'DF-6', 'DF-7'];
//exp[RF] = ['DF-2', 'DF-3', 'DF-4', 'DF-5', 'DF-6', 'DF-7'];



export default exp;