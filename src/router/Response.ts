import http from "http";
import SlowRequest from "./Request.js";

type data = string | number | boolean | object | undefined | null;

class SlowResponse<
  Request extends http.IncomingMessage = SlowRequest
> extends http.ServerResponse<Request> {
  constructor(req: Request) {
    super(req);
  }
  send(data: data): this {
    this.end(data);
    return this;
  }
}

export default SlowResponse;

// Path: src/router/Response.ts
