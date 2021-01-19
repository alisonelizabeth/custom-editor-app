import * as monaco from "monaco-editor";
import { getSyntaxErrors } from './parser';

export class TodoWorker {
  private _ctx: monaco.worker.IWorkerContext;

  constructor(ctx: monaco.worker.IWorkerContext) {
    this._ctx = ctx;
  }

  private getTextDocument(modelUri: string): string | undefined {
    const model = this._ctx.getMirrorModels().find((m) => m.uri.toString() === modelUri);

    return model?.getValue();
  }

  public async getSyntaxErrors(modelUri: string) {
    const code = this.getTextDocument(modelUri);

    if (code) {
      // const semanticErrors = getSemanticErrors(code);
      // console.log(semanticErrors);
      return getSyntaxErrors(code);
    }
  }

  public provideAutocompleteSuggestions(currentLineChars: string) {
    // Array of the active line words
    const words = currentLineChars.replace('\t', '').split(' ');

    // const autocompleteSuggestions: PainlessCompletionResult = getAutocompleteSuggestions(
    //   context,
    //   words,
    //   fields
    // );

    return ['foo'];
  }
}
