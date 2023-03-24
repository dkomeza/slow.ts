import http from "http";
import SlowRequest from "./Request.js";

class SlowResponse<
  Request extends http.IncomingMessage = SlowRequest
> extends http.ServerResponse<Request> {
  constructor(req: Request) {
    super(req);
  }
  send(data: string | number | boolean | object | undefined | null): this {
    const type = typeof data;
    if (data === undefined || data === null) {
      this.end();
      return this;
    }
    if (type === "string") {
      this.setHeader("Content-Type", "text/plain");
      this.end(data);
    } else if (type === "number") {
      this.setHeader("Content-Type", "text/plain");
      this.end(data.toString());
    } else if (type === "boolean") {
      this.setHeader("Content-Type", "text/plain");
      this.end(data.toString());
    } else if (type === "object") {
      this.setHeader("Content-Type", "application/json");
      this.end(JSON.stringify(data));
    }
    return this;
  }
}

export default SlowResponse;

// Path: src/router/Response.ts
