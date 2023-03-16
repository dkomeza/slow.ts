import http from "http";

class SlowResponse<Request extends http.IncomingMessage = http.IncomingMessage>
  extends http.ServerResponse<Request>
  implements SlowResponse
{
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
