import { CommonTokenStream, CharStreams, Token } from 'antlr4ts';
import { TodoParser, TodoExpressionsContext, AddExpressionContext, CompleteExpressionContext, DeleteExpressionContext } from '../antlr/TodoParser';
import { TodoLexer } from '../antlr/TodoLexer';
import { TodoError, TodoErrorListener } from './error_listener';
import { monarchLanguage } from './monarch_language_configuration';

const parse = (
  code: string
): {
  errors: TodoError[];
  ast: TodoExpressionsContext;
} => {
  // Create the stream of characters from the text
  const inputStream = CharStreams.fromString(code);
  // Pass it to the lexer and transform it into tokens
  const lexer = new TodoLexer(inputStream);
  const tokenStream = new CommonTokenStream(lexer);
  // Initiate parser, which will interpret the tokens
  const parser = new TodoParser(tokenStream);
  // Initiate error listener
  const todoErrorListener = new TodoErrorListener();

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
  const deletedTodos: string[] = [];

  ast.children?.forEach(node => {
    if (node instanceof AddExpressionContext) {
      const addTodoString = node.STRING().text;
      const isExistingTodo = Boolean(existingTodos.find(existingTodo => existingTodo === addTodoString));

      if (isExistingTodo) {
        if (node.stop) {
          errors.push(getSemanticErrorMsg(node.stop, `ADD TODO ${addTodoString} is already defined.`))
        }
      } else {
        existingTodos.push(addTodoString)
      }
    } else if (node instanceof DeleteExpressionContext) {
      const deleteTodoString = node.STRING().text;
      const isExistingDeleteTodo = Boolean(deletedTodos.find(deletedTodo => deletedTodo === deleteTodoString));
      const isTodoDefined = Boolean(existingTodos.find(existingTodo => existingTodo === deleteTodoString));

      if (isExistingDeleteTodo === false) {
        deletedTodos.push(deleteTodoString);
      }

      if (isTodoDefined === false) {
        if (node.stop) {
          errors.push(getSemanticErrorMsg(node.stop, `TODO ${deleteTodoString} has not been defined.`));
        }
      }
    } else if (node instanceof CompleteExpressionContext) {
      const completeTodoString = node.STRING().text;
      const isTodoDefined = Boolean(existingTodos.find(existingTodo => existingTodo === completeTodoString));
      const isTodoDeleted = Boolean(deletedTodos.find(deletedTodo => deletedTodo === completeTodoString));

      if (isTodoDefined === false) {
        if (node.stop) {
          errors.push(getSemanticErrorMsg(node.stop, `TODO ${completeTodoString} has not been defined.`));
        }
      } else if (isTodoDeleted) {
        if (node.stop) {
          errors.push(getSemanticErrorMsg(node.stop, `TODO ${completeTodoString} has been deleted.`));
        }
      }
    }
  })
  return errors;
}

export const getAutocompleteSuggestions = (words: string[], code: string) => {
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

  console.log(words);
  console.log(currentKeyword);
  if (words.length === 3 && currentKeyword === 'COMPLETE') {
    const { ast } = parse(code);

    const existingTodos: string[] = [];

    ast.children?.forEach(node => {
      if (node instanceof AddExpressionContext) {
        const addTodoString = node.STRING().text;
        const isExistingTodo = Boolean(existingTodos.find(existingTodo => existingTodo === addTodoString));

        if (isExistingTodo === false) {
          existingTodos.push(addTodoString)
        }
      }
    })

    return existingTodos.map((todo: string) => {
      const todoDisplayName = todo.replace(/['"]+/g, '');

      return {
        label: todoDisplayName,
        kind: 'string',
        documentation: `Add todo text: ${todoDisplayName}`,
        insertText: todoDisplayName,
      };
    });
  }

  return [];
}

