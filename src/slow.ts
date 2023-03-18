import http from "http";
import { methods } from "./utils/const.js";

import Router from "./router/Router.js";
import SlowResponse from "./router/Response.js";
import SlowRequest from "./router/Request.js";

class slow {
  private _router: Router;
  constructor() {
    this._router = new Router();
  }

  router = (
    method: typeof methods[number],
    path: string,
    callback: (req: SlowRequest, res: SlowResponse) => void
  ) => {
    const route = this._router.route(path);
    route.methods[method] = callback;
  };

  private async handle(req: SlowRequest, res: SlowResponse) {
    await req.init();
    this._router.handle(req, res);
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
}

export default slow;
export const app = new slow();
