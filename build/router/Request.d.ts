/// <reference types="node" />
/// <reference types="node" />
import http from "http";
import { Socket } from "net";
declare class SlowRequest extends http.IncomingMessage {
    body: {
        [key: string]: any;
    };
    data: string;
    constructor(socket: Socket);
    init(): Promise<void>;
    parseRequest(): void;
    parseGetRequest(): void;
    parsePostRequest(): void;
}
export default SlowRequest;
//# sourceMappingURL=Request.d.ts.map