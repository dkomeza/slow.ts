import http, { IncomingMessage, ServerResponse } from "http";
import { methods } from "./utils/const.js";

import Router from "./router/router.js";

class slow implements slow {
  private router: Router;
  constructor() {
    this.router = new Router();
  }

  route(method: typeof methods[number]) {}

  private handle(req: IncomingMessage, res: ServerResponse) {
    this.router.handle(req, res);
  }

  listen(port?: number, callback?: () => void) {
    const hostPort = port || 5000;
    const server = http.createServer(this.handle.bind(this));
    server.on;
    return server.listen.apply(server, [hostPort, callback]);
  }
}

export default slow;
export const app = new slow();
