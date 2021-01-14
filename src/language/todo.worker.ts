// @ts-ignore
import * as worker from 'monaco-editor/esm/vs/editor/editor.worker';
import * as monaco from "monaco-editor";
import { TodoWorker } from './todo_worker';

self.onmessage = () => {
  worker.initialize((ctx: monaco.worker.IWorkerContext) => {
    return new TodoWorker(ctx);
  });
};
