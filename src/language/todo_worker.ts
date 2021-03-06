import * as monaco from "monaco-editor";
import { getSyntaxErrors, getSemanticErrors, getAutocompleteSuggestions } from './language_utils';

export class TodoWorker {
  private _ctx: monaco.worker.IWorkerContext;

  constructor(ctx: monaco.worker.IWorkerContext) {
    this._ctx = ctx;
  }

  private getTextDocument(modelUri: string): string | undefined {
    const model = this._ctx.getMirrorModels().find((m) => m.uri.toString() === modelUri);

    return model?.getValue();
  }

  public async getErrors(modelUri: string) {
    const code = this.getTextDocument(modelUri);

    if (code) {
      const semanticErrors = getSemanticErrors(code);
      const syntaxErrors = getSyntaxErrors(code);
      return [...semanticErrors, ...syntaxErrors];
    }
  }

  public getAutocompleteSuggestions(words: string[], modelUri: string) {
    const code = this.getTextDocument(modelUri);

    const autocompleteSuggestions = getAutocompleteSuggestions(
      words,
      code,
    );
    return autocompleteSuggestions;
  }
}
