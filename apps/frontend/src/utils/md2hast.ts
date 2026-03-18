import Md2HastWorker from "../worker/md2hast.worker.ts?worker";
import type { Root } from "hast";

const worker = new Md2HastWorker();
let currentId = 0;

export function md2hast(md: string): Promise<{ id: number; hast: Root }> {
  return new Promise((resolve) => {
    worker.onmessage = (e) => {
      resolve(e.data);
    };
    worker.postMessage({ id: currentId, md });
    currentId++;
  });
}
