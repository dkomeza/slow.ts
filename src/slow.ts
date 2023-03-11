import http, { IncomingMessage, ServerResponse } from "http";

import Router from "./router/router.js";

class slow implements slow {
  private router: Router;
  constructor() {
    this.router = new Router();
  }

  route() {

  }

  private handle(req: IncomingMessage, res: ServerResponse) {
    this.router.handle(req, res);
  }

  listen(port: number, callback: () => void) {
    const server = http.createServer(this.handle.bind(this));
    server.on;
    return server.listen.apply(server, [port, callback]);
  }
}

export default slow;
