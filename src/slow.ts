import http from "http";
import { methods } from "./utils/const.js";

import Router from "./router/Router.js";
import SlowResponse from "./router/Response.js";
import SlowRequest from "./router/Request.js";

class slow {
  router: Router;
  constructor() {
    this.router = new Router();
  }

  private async handle(req: SlowRequest, res: SlowResponse) {
    await req.init();
    this.router.handle(req, res);
  }

  listen(port?: number, callback?: () => void) {
    const hostPort = port || 5000;
    const server = http.createServer(
      {
        IncomingMessage: SlowRequest,
        ServerResponse: SlowResponse,
      },
      this.handle.bind(this)
    );
    return server.listen.apply(server, [hostPort, callback]);
  }

  close(cb?: () => void) {
    return this.listen().close(cb);
  }
}

export default slow;
export const app = new slow();
