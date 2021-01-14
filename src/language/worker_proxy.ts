import * as monaco from "monaco-editor";
import { TodoWorker } from './todo_worker';
import { LANGUAGE_ID } from './constants';

export class WorkerProxyService {
  private worker: monaco.editor.MonacoWebWorker<TodoWorker> | undefined;

  public async getWorker(resources: monaco.Uri[]) {
    if (!this.worker) {
      throw new Error('Worker Proxy Service has not been setup!');
    }

    await this.worker.withSyncedResources(resources);
    const proxy = await this.worker.getProxy();
    return proxy;
  }

  public setup() {
    this.worker = monaco.editor.createWebWorker({ label: LANGUAGE_ID, moduleId: '' });
  }

  public stop() {
    if (this.worker) this.worker.dispose();
  }
}
