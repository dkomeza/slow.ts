/// <reference types="node" />
import http from "http";
import { methods } from "./utils/const.js";
import SlowResponse from "./router/Response.js";
import SlowRequest from "./router/Request.js";
declare class slow {
    private _router;
    constructor();
    router: (method: (typeof methods)[number], path: string, callback: (req: SlowRequest, res: SlowResponse) => void) => void;
    private handle;
    listen(port?: number, callback?: () => void): http.Server<typeof SlowRequest, typeof SlowResponse>;
}
export default slow;
export declare const app: slow;
//# sourceMappingURL=slow.d.ts.map