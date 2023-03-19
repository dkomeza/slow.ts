/// <reference types="node" />
import http from "http";
import SlowRequest from "./Request.js";
declare class SlowResponse<Request extends http.IncomingMessage = SlowRequest> extends http.ServerResponse<Request> {
    constructor(req: Request);
    send(data: any): this;
}
export default SlowResponse;
//# sourceMappingURL=Response.d.ts.map