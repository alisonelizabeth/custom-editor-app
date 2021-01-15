import * as monaco from "monaco-editor";

import { LANGUAGE_ID } from './constants';
import { TodoWorker } from './todo_worker';
import { WorkerProxyService} from './worker_proxy';
import { TodoCompletionAdapter} from './completion_adapter';
import { TodoDiagnosticsAdapter } from './diagnostics_adapter';
import { monarchLanguage, languageConfiguration } from './lexer_rules';

export type WorkerAccessor = (...uris: monaco.Uri[]) => Promise<TodoWorker>;
export const setupLanguage = () => {
  // @ts-ignore
  window.MonacoEnvironment = {
    getWorkerUrl: (moduleId: string, label: string) => {
      if (label === LANGUAGE_ID) {
        return './todo.worker.bundle.js';
      }
      return './editor.worker.bundle.js';
    },
  };

  monaco.languages.register({ id: LANGUAGE_ID });

  monaco.languages.onLanguage(LANGUAGE_ID, async () => {
    const workerProxyService = new WorkerProxyService();
    
    workerProxyService.setup();

    const worker: WorkerAccessor = (...uris: monaco.Uri[]): Promise<TodoWorker> => {
      return workerProxyService.getWorker(uris);
    };

    monaco.languages.setMonarchTokensProvider(LANGUAGE_ID, monarchLanguage);
    // TODO fix config
    monaco.languages.setLanguageConfiguration(LANGUAGE_ID, languageConfiguration);

    monaco.languages.registerCompletionItemProvider(LANGUAGE_ID, new TodoCompletionAdapter(worker));

    new TodoDiagnosticsAdapter(worker);
  });

}
