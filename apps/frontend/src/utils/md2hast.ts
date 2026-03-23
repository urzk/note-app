import Md2HastWorker from "../worker/md2hast.worker.ts?worker";
import type { Request, Response } from "../types/mdToHastSession";

const worker = new Md2HastWorker();
let currentId = 0;

export function md2hast(md: string): Promise<Response> {
  return new Promise((resolve) => {
    worker.onmessage = (e) => {
      resolve(e.data);
    };
    const req: Request = { sessionId: currentId, md };
    worker.postMessage(req);
    currentId++;
  });
}
