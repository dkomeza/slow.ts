import http, { IncomingMessage, ServerResponse, ServerOptions } from "http";
import { methods } from "./utils/const.js";

import Router from "./router/Router.js";
import SlowResponse from "./router/Response.js";

class slow {
  private _router: Router;
  constructor() {
    this._router = new Router();
  }

  router = (
    method: typeof methods[number],
    path: string,
    callback: (req: IncomingMessage, res: SlowResponse) => void
  ) => {
    const route = this._router.route(path);
    route.methods[method] = callback;
  };

  private handle(req: IncomingMessage, res: SlowResponse) {
    this._router.handle(req, res);
  }

  listen(port?: number, callback?: () => void) {
    const hostPort = port || 5000;
    const server = http.createServer(
      {
        IncomingMessage: IncomingMessage,
        ServerResponse: SlowResponse,
      },
      this.handle.bind(this)
    );
    return server.listen.apply(server, [hostPort, callback]);
  }
}

export default slow;
export const app = new slow();
