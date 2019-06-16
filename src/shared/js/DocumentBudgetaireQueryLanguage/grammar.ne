# Grammar inspired by https://github.com/kach/nearley/blob/master/examples/calculator/arithmetic.ne

main -> _ AS _      {% ts => ts[1] %}

# Order of definition decides precedence

# Parentheses
P -> "(" _ AS _ ")"     {% ts => ts.filter(x => !!x) %}
    | SUBSET            {% id %}

# Intersection
M -> M _ "∩" _ P    {% ts => ts.filter(x => !!x) %}
    | P             {% id %}

# Union and subtraction 
AS -> AS _ "+" _ M  {% ts => ts.filter(x => !!x) %}
    | AS _ "∪" _ M  {% ts => ts.filter(x => !!x) %}
    | AS _ "-" _ M  {% ts => ts.filter(x => !!x) %}
    | M             {% id %}

# Subsets 
SUBSET -> RD        {% id %}
    | FI            {% id %}
    | RDFI          {% id %}
#    | OPERATION     {% id %}
    | CHAPITRE      {% id %}
    | COMPTE        {% id %}
    | FONCTION      {% id %}
    | ANNEE         {% id %}

RD -> "R"   {% id %}
    | "D"   {% id %}

FI -> "F"   {% id %}
    | "I"   {% id %}

RDFI -> RD FI                   {% ts => ts.join('') %}

# OPERATION -> "OR"               {% id %}

CHAPITRE -> "Ch" [0-9]:+         {% ts => ts[0]+ts[1].join('') %}

COMPTE -> "C" [0-9]:+           {% ts => ts[0]+ts[1].join('') %}

FONCTION -> "F" [0-9]:+         {% ts => ts[0]+ts[1].join('') %}

ANNEE -> "Ann" [0-9]:+          {% ts => ts[0]+ts[1].join('') %}


# Whitespace
_ -> [\s]:*     {% () => null %}
