parser grammar todoParser;

todoExpressions : (addExpression)* (completeExpression)*;

addExpression : ADD TODO STRING EOL;
completeExpression : COMPLETE TODO STRING EOL;
