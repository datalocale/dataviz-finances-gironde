// Generated automatically by nearley, version 2.16.0
// http://github.com/Hardmath123/nearley
(function () {
function id(x) { return x[0]; }
var grammar = {
    Lexer: undefined,
    ParserRules: [
    {"name": "main", "symbols": ["_", "AS", "_"], "postprocess": ts => ts[1]},
    {"name": "P", "symbols": [{"literal":"("}, "_", "AS", "_", {"literal":")"}], "postprocess": ts => ts.filter(x => !!x)},
    {"name": "P", "symbols": ["SUBSET"], "postprocess": id},
    {"name": "M", "symbols": ["M", "_", {"literal":"∩"}, "_", "P"], "postprocess": ts => ts.filter(x => !!x)},
    {"name": "M", "symbols": ["P"], "postprocess": id},
    {"name": "AS", "symbols": ["AS", "_", {"literal":"+"}, "_", "M"], "postprocess": ts => ts.filter(x => !!x)},
    {"name": "AS", "symbols": ["AS", "_", {"literal":"∪"}, "_", "M"], "postprocess": ts => ts.filter(x => !!x)},
    {"name": "AS", "symbols": ["AS", "_", {"literal":"-"}, "_", "M"], "postprocess": ts => ts.filter(x => !!x)},
    {"name": "AS", "symbols": ["M"], "postprocess": id},
    {"name": "SUBSET", "symbols": ["RD"], "postprocess": id},
    {"name": "SUBSET", "symbols": ["FI"], "postprocess": id},
    {"name": "SUBSET", "symbols": ["RDFI"], "postprocess": id},
    {"name": "SUBSET", "symbols": ["CHAPITRE"], "postprocess": id},
    {"name": "SUBSET", "symbols": ["COMPTE"], "postprocess": id},
    {"name": "SUBSET", "symbols": ["FONCTION"], "postprocess": id},
    {"name": "SUBSET", "symbols": ["ANNEE"], "postprocess": id},
    {"name": "RD", "symbols": [{"literal":"R"}], "postprocess": id},
    {"name": "RD", "symbols": [{"literal":"D"}], "postprocess": id},
    {"name": "FI", "symbols": [{"literal":"F"}], "postprocess": id},
    {"name": "FI", "symbols": [{"literal":"I"}], "postprocess": id},
    {"name": "RDFI", "symbols": ["RD", "FI"], "postprocess": ts => ts.join('')},
    {"name": "CHAPITRE$string$1", "symbols": [{"literal":"C"}, {"literal":"h"}], "postprocess": function joiner(d) {return d.join('');}},
    {"name": "CHAPITRE$ebnf$1", "symbols": [/[0-9]/]},
    {"name": "CHAPITRE$ebnf$1", "symbols": ["CHAPITRE$ebnf$1", /[0-9]/], "postprocess": function arrpush(d) {return d[0].concat([d[1]]);}},
    {"name": "CHAPITRE", "symbols": ["CHAPITRE$string$1", "CHAPITRE$ebnf$1"], "postprocess": ts => ts[0]+ts[1].join('')},
    {"name": "COMPTE$ebnf$1", "symbols": [/[0-9]/]},
    {"name": "COMPTE$ebnf$1", "symbols": ["COMPTE$ebnf$1", /[0-9]/], "postprocess": function arrpush(d) {return d[0].concat([d[1]]);}},
    {"name": "COMPTE", "symbols": [{"literal":"C"}, "COMPTE$ebnf$1"], "postprocess": ts => ts[0]+ts[1].join('')},
    {"name": "FONCTION$ebnf$1", "symbols": [/[0-9]/]},
    {"name": "FONCTION$ebnf$1", "symbols": ["FONCTION$ebnf$1", /[0-9]/], "postprocess": function arrpush(d) {return d[0].concat([d[1]]);}},
    {"name": "FONCTION", "symbols": [{"literal":"F"}, "FONCTION$ebnf$1"], "postprocess": ts => ts[0]+ts[1].join('')},
    {"name": "ANNEE$string$1", "symbols": [{"literal":"A"}, {"literal":"n"}, {"literal":"n"}], "postprocess": function joiner(d) {return d.join('');}},
    {"name": "ANNEE$ebnf$1", "symbols": [/[0-9]/]},
    {"name": "ANNEE$ebnf$1", "symbols": ["ANNEE$ebnf$1", /[0-9]/], "postprocess": function arrpush(d) {return d[0].concat([d[1]]);}},
    {"name": "ANNEE", "symbols": ["ANNEE$string$1", "ANNEE$ebnf$1"], "postprocess": ts => ts[0]+ts[1].join('')},
    {"name": "_$ebnf$1", "symbols": []},
    {"name": "_$ebnf$1", "symbols": ["_$ebnf$1", /[\s]/], "postprocess": function arrpush(d) {return d[0].concat([d[1]]);}},
    {"name": "_", "symbols": ["_$ebnf$1"], "postprocess": () => null}
]
  , ParserStart: "main"
}
if (typeof module !== 'undefined'&& typeof module.exports !== 'undefined') {
   module.exports = grammar;
} else {
   window.grammar = grammar;
}
})();
