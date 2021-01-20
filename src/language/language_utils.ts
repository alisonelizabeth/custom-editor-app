import { CommonTokenStream, CharStreams, Token } from 'antlr4ts';
import { TodoParser, TodoExpressionsContext, AddExpressionContext, CompleteExpressionContext } from '../antlr/TodoParser';
import { TodoLexer } from '../antlr/TodoLexer';
import { TodoError, TodoErrorListener } from './error_listener';
import { monarchLanguage } from './lexer_rules';

const parse = (
  code: string
): {
  errors: TodoError[];
  ast: TodoExpressionsContext;
} => {
  const inputStream = CharStreams.fromString(code);
  const lexer = new TodoLexer(inputStream);
  const todoErrorListener = new TodoErrorListener();
  const tokenStream = new CommonTokenStream(lexer);
  const parser = new TodoParser(tokenStream);

  lexer.removeErrorListeners();
  parser.removeErrorListeners();

  lexer.addErrorListener(todoErrorListener);
  parser.addErrorListener(todoErrorListener);

  const ast = parser.todoExpressions();
  const errors: TodoError[] = todoErrorListener.getErrors();

  return {
    ast,
    errors,
  };
};

export const getSyntaxErrors = (code: string): TodoError[] => {
  const { errors } = parse(code);
  return errors;
};


const getSemanticErrorMsg = (token: Token, message: string) => {
  return {
    endColumn: token.charPositionInLine + token.stopIndex - token.stopIndex,
    endLineNumber: token.line,
    message,
    startColumn: token.charPositionInLine,
    startLineNumber: token.line
  }
}

export const getSemanticErrors = (code: string): TodoError[] => {
  const { ast } = parse(code);

  const errors: TodoError[] = [];
  const existingTodos: string[] = [];

  ast.children?.forEach(node => {
    if (node instanceof AddExpressionContext) {
      const addTodoString = node.STRING().text;
      const isExistingTodo = Boolean(existingTodos.find(existingTodo => existingTodo === addTodoString));

      if (isExistingTodo) {
        if (node.stop) {
          errors.push(getSemanticErrorMsg(node.stop, `ADD TODO ${addTodoString} is already defined`))
        }
      } else {
        existingTodos.push(addTodoString)
      }
    } else if (node instanceof CompleteExpressionContext) {
      const completeTodoString = node.STRING().text;
      const isTodoDefined = Boolean(existingTodos.find(existingTodo => existingTodo === completeTodoString));

      if (isTodoDefined === false) {
        if (node.stop) {
          errors.push(getSemanticErrorMsg(node.stop, `TODO ${completeTodoString} has not been defined`));
        }
      }
    }
  })
  return errors;
}

export const getAutocompleteSuggestions = (words: string[]) => {
  const currentKeyword = words[0];
  // @ts-ignore
  const availableKeywords = monarchLanguage.keywords;
  const hasKeyword = Boolean(availableKeywords.find((availableKeyword: string) => currentKeyword === availableKeyword));

  if (words.length === 1) {
    return availableKeywords.map((keywordName: string ) => {
      return {
        label: keywordName,
        kind: 'keyword',
        documentation: `Keyword: ${keywordName}`,
        insertText: keywordName,
      };
    });
  }

  // Only provide type autocomplete if the expression first contains a keyword
  if (words.length === 2 && hasKeyword) {
    // @ts-ignore
    const typeKeyword = monarchLanguage.typeKeywords[0]; // at the moment there is only one type keyword
    return [{
      label: typeKeyword,
      kind: 'type',
      documentation: `Type: ${typeKeyword}`,
      insertText: typeKeyword,
    }]
  }

  // TODO add autocompletion of "COMPLETE" todos using ast

  return [];
}

