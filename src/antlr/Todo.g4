grammar Todo;

todoExpressions : (addExpression)* (deleteExpression)* (completeExpression)*;

addExpression : ADD TODO STRING;
deleteExpression : DELETE TODO STRING;  
completeExpression : COMPLETE TODO STRING;

ADD : 'ADD';
DELETE: 'DELETE';
TODO : 'TODO';
COMPLETE: 'COMPLETE';
STRING: '"' ~ ["]* '"';
EOL: [\r\n] + -> skip;
WS: [ \t] -> skip;
