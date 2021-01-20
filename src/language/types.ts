import * as monaco from "monaco-editor";
import { TodoWorker } from './todo_worker';

export type WorkerAccessor = (...uris: monaco.Uri[]) => Promise<TodoWorker>;
