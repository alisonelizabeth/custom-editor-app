import * as monaco from "monaco-editor";
import { TodoWorker } from './todo_worker';

const getCompletionKind = (kind: 'type' | 'keyword' | 'string'): monaco.languages.CompletionItemKind => {
  const monacoItemKind = monaco.languages.CompletionItemKind;

  switch (kind) {
    case 'type':
      return monacoItemKind.Interface;
    case 'keyword':
      return monacoItemKind.Keyword;
    case 'string':
      return monacoItemKind.Text;
    default:
      return monacoItemKind.Text;
  }
};
export class TodoCompletionAdapter implements monaco.languages.CompletionItemProvider {
  constructor(
    private worker: {
      (...uris: monaco.Uri[]): Promise<TodoWorker>;
      (arg0: monaco.Uri): Promise<TodoWorker>;
    },
  ) { }

  public get triggerCharacters(): string[] {
    return [`"`];
  }

  async provideCompletionItems(
    model: monaco.editor.IReadOnlyModel,
    position: monaco.Position
  ): Promise<monaco.languages.CompletionList> {
    // Active line characters
    const currentLineChars = model.getValueInRange({
      startLineNumber: position.lineNumber,
      startColumn: 0,
      endLineNumber: position.lineNumber,
      endColumn: position.column,
    });
    // Array of active words
    const words = currentLineChars.replace('\t', '').split(' ');

    const worker = await this.worker(model.uri);

    const suggestions = await worker.getAutocompleteSuggestions(
      words,
      model.uri.toString()
    );

    const wordInfo = model.getWordUntilPosition(position);
    const wordRange = {
      startLineNumber: position.lineNumber,
      endLineNumber: position.lineNumber,
      startColumn: wordInfo.startColumn,
      endColumn: wordInfo.endColumn,
    };

    const suggestionsWithKind = suggestions.map(
      ({ label, insertText, documentation, kind }) => {
        return {
          label,
          insertText,
          documentation,
          range: wordRange,
          kind: getCompletionKind(kind),
        };
      }
    );

    return {
      incomplete: false,
      suggestions: suggestionsWithKind,
    };
  }
}
