import http from "http";
import { methods } from "./utils/const.js";

import Router from "./router/Router.js";
import SlowResponse from "./router/Response.js";
import SlowRequest from "./router/Request.js";

class slow {
  server: http.Server;
  router: Router;
  constructor() {
    this.router = new Router();
    this.server = http.createServer(
      {
        IncomingMessage: SlowRequest,
        ServerResponse: SlowResponse,
      },
      this.handle.bind(this)
    );
  }

  private async handle(req: SlowRequest, res: SlowResponse) {
    await req.init();
    this.router.handle(req, res);
  }

  listen(port?: number, callback?: () => void) {
    const hostPort = port || 5000;
    return this.server.listen.apply(this.server, [hostPort, callback]);
  }

  close(cb?: () => void) {
    return this.server.close(cb);
  }
}

export default slow;
export const app = new slow();
