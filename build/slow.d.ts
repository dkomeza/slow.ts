/// <reference types="node" />
import http from "http";
import Router from "./router/Router.js";
declare class slow {
    server: http.Server;
    router: Router;
    constructor();
    private handle;
    listen(port?: number, callback?: () => void): http.Server<typeof http.IncomingMessage, typeof http.ServerResponse>;
    close(cb?: () => void): http.Server<typeof http.IncomingMessage, typeof http.ServerResponse>;
}
export default slow;
export declare const app: slow;
//# sourceMappingURL=slow.d.ts.map