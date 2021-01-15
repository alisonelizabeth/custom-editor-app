parser grammar TodoParser;

todoExpressions : (addExpression)* (completeExpression)*;

addExpression : ADD TODO STRING EOL;
completeExpression : COMPLETE TODO STRING EOL;
