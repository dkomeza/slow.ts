import http from "http";
import SlowRequest from "./Request.js";

class SlowResponse<
  Request extends http.IncomingMessage = SlowRequest
> extends http.ServerResponse<Request> {
  constructor(req: Request) {
    super(req);
  }
  send(data: any): this {
    this.end(data);
    return this;
  }
}

export default SlowResponse;

// Path: src/router/Response.ts
