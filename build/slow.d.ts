/// <reference types="node" />
import http from "http";
import Router from "./router/Router.js";
import SlowResponse from "./router/Response.js";
import SlowRequest from "./router/Request.js";
declare class slow {
    router: Router;
    constructor();
    private handle;
    listen(port?: number, callback?: () => void): http.Server<typeof SlowRequest, typeof SlowResponse>;
}
export default slow;
export declare const app: slow;
//# sourceMappingURL=slow.d.ts.map