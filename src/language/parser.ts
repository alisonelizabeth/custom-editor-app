import { CommonTokenStream, CharStreams } from 'antlr4ts';
import { TodoParser, TodoExpressionsContext } from '../antlr/TodoParser';
import { TodoLexer } from '../antlr/TodoLexer';
import { TodoError, TodoErrorListener } from './error_listener';

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

export const parseAndGetSyntaxErrors = (code: string): TodoError[] => {
  const { errors } = parse(code);
  return errors;
};
