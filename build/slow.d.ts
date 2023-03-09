/// <reference types="node" />
import http from "http";
export default class slow {
    constructor();
    listen(port: number, callback: () => void): http.Server<typeof http.IncomingMessage, typeof http.ServerResponse>;
}
//# sourceMappingURL=slow.d.ts.map