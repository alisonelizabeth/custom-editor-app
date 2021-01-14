import * as monaco from "monaco-editor";

export class TodoWorker {
  private _ctx: monaco.worker.IWorkerContext;

  constructor(ctx: monaco.worker.IWorkerContext) {
    this._ctx = ctx;
  }

  private getTextDocument(modelUri: string): string | undefined {
    const model = this._ctx.getMirrorModels().find((m) => m.uri.toString() === modelUri);

    return model?.getValue();
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
