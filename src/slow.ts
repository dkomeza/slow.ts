import http, { IncomingMessage, ServerResponse, METHODS } from "http";

import Router from "./router/router.js";
import * as CONST from "./utils/const.js";

class slow implements slow {
  private router: Router;
  [key: string]: any;
  constructor() {
    this.router = new Router();
    CONST.methods.forEach((method) => {
      this[method] = function (path: string, args: any) {
        this.registerPath(path, method, args);
      };
    });
  }

  private registerPath(path: string, method: string, args: any) {
    const route = this.router.route(path);
    // route[method].apply(route, args);
    return this;
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
