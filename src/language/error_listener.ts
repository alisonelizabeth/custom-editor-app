
import { ANTLRErrorListener, RecognitionException, Recognizer } from 'antlr4ts';

export interface TodoError {
  startLineNumber: number;
  startColumn: number;
  endLineNumber: number;
  endColumn: number;
  message: string;
}

export class TodoErrorListener implements ANTLRErrorListener<any> {
  private errors: TodoError[] = [];

  syntaxError(
    recognizer: Recognizer<any, any>,
    offendingSymbol: any,
    line: number,
    column: number,
    message: string,
    e: RecognitionException | undefined
  ): void {
    let endColumn = column + 1;

    if (offendingSymbol?._text) {
      endColumn = column + offendingSymbol._text.length;
    }

    this.errors.push({
      startLineNumber: line,
      endLineNumber: line,
      startColumn: column,
      endColumn,
      message,
    });
  }

  getErrors(): TodoError[] {
    return this.errors;
  }
}
