/// <reference types="node" />
import http from "http";
import { methods } from "./utils/const.js";
declare class slow implements slow {
    private router;
    constructor();
    route(method: typeof methods[number]): void;
    private handle;
    listen(port?: number, callback?: () => void): http.Server<typeof http.IncomingMessage, typeof http.ServerResponse>;
}
export default slow;
export declare const app: slow;
//# sourceMappingURL=slow.d.ts.map