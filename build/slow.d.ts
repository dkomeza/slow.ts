/// <reference types="node" />
import http, { IncomingMessage } from "http";
import { methods } from "./utils/const.js";
import SlowResponse from "./router/Response.js";
declare class slow implements slow {
    private router;
    constructor();
    route(method: typeof methods[number], path: string, callback: (req: IncomingMessage, res: SlowResponse) => void): void;
    private handle;
    listen(port?: number, callback?: () => void): http.Server<typeof http.IncomingMessage, typeof SlowResponse>;
}
export default slow;
export declare const app: slow;
//# sourceMappingURL=slow.d.ts.map