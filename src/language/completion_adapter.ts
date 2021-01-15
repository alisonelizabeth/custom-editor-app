import * as monaco from "monaco-editor";
import { TodoWorker } from './todo_worker';

export class TodoCompletionAdapter implements monaco.languages.CompletionItemProvider {
  constructor(
    private worker: {
      (...uris: monaco.Uri[]): Promise<TodoWorker>;
      (arg0: monaco.Uri): Promise<TodoWorker>;
    },
  ) { }

  public get triggerCharacters(): string[] {
    return ['.', `'`];
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

    const worker = await this.worker(model.uri);

    const autocompleteInfo = await worker.provideAutocompleteSuggestions(
      currentLineChars
    );

    console.log(' autocomplete', autocompleteInfo)


    // const wordInfo = model.getWordUntilPosition(position);
    // const wordRange = {
    //   startLineNumber: position.lineNumber,
    //   endLineNumber: position.lineNumber,
    //   startColumn: wordInfo.startColumn,
    //   endColumn: wordInfo.endColumn,
    // };

    // const suggestions = autocompleteInfo.suggestions.map(
    //   ({ label, insertText, documentation, kind, insertTextAsSnippet }) => {
    //     return {
    //       label,
    //       insertText,
    //       documentation,
    //       range: wordRange,
    //       kind: getCompletionKind(kind),
    //       insertTextRules: insertTextAsSnippet
    //         ? monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet
    //         : undefined,
    //     };
    //   }
    // );

    return {
      incomplete: false,
      suggestions: [],
    };
  }
}
