/// <reference types="node" />
import http from "http";
declare class slow implements slow {
    private router;
    [key: string]: any;
    constructor();
    private registerPath;
    private handle;
    listen(port: number, callback: () => void): http.Server<typeof http.IncomingMessage, typeof http.ServerResponse>;
}
export default slow;
//# sourceMappingURL=slow.d.ts.map