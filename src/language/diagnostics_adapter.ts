import * as monaco from "monaco-editor";
import { LANGUAGE_ID } from './constants';
import { WorkerAccessor } from './language';
import { TodoError } from './error_listener';

const toDiagnostics = (error: TodoError): monaco.editor.IMarkerData => {
  return {
    ...error,
    severity: monaco.MarkerSeverity.Error,
  };
};

export class TodoDiagnosticsAdapter {
  constructor(private worker: WorkerAccessor) {
    const onModelAdd = (model: monaco.editor.IModel): void => {
      let handle: any;

      if (model.getModeId() === LANGUAGE_ID) {
        model.onDidChangeContent(() => {
          // Every time a new change is made, wait 500ms before validating
          clearTimeout(handle);
          handle = setTimeout(() => this.validate(model.uri), 500);
        });

        this.validate(model.uri);
      }
    };
    monaco.editor.onDidCreateModel(onModelAdd);
    monaco.editor.getModels().forEach(onModelAdd);
  }

  private async validate(resource: monaco.Uri): Promise<void> {
    const worker = await this.worker(resource);
    const errorMarkers = await worker.getSyntaxErrors(resource.toString());

    if (errorMarkers) {
      const model = monaco.editor.getModel(resource);
      // Set the error markers and underline them with "Error" severity
      monaco.editor.setModelMarkers(model!, LANGUAGE_ID, errorMarkers.map(toDiagnostics));
    }
  }
}
