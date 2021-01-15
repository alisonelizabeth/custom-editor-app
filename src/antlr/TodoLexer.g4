lexer grammar TodoLexer;

ADD : 'ADD';
TODO : 'TODO';
COMPLETE: 'COMPLETE';
STRING: '"' ~ ["]* '"';
EOL: [\r\n] +;
WS: [ \t] -> skip;
