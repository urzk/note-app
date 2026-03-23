import type { Root } from "hast";

export type Request = { sessionId: number; md: string };
export type Response = { sessionId: number; hast: Root };
