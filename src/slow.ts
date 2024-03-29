import http from "http";

import Router from "./router/Router.js";
import SlowResponse from "./router/Response.js";
import SlowRequest from "./router/Request.js";

interface SlowOptions {
  router?: boolean;
}

class slow {
  server: http.Server;
  router: Router | undefined;
  constructor(opts?: SlowOptions) {
    this.server = http.createServer(
      {
        IncomingMessage: SlowRequest,
        ServerResponse: SlowResponse,
      },
      this.handle.bind(this)
    );
    // create router by default
    if (opts?.router !== false) {
      this.router = new Router();
    }
  }

  private async handle(req: SlowRequest, res: SlowResponse) {
    await req.init();
    if (this.router) {
      this.router.handle(req, res);
    }
  }

  registerMiddleware(
    path: string,
    middleware: (req: SlowRequest, res: SlowResponse, next: () => void) => void
  ) {
    if (this.router) {
      this.router.registerMiddleware(path, middleware);
    }
  }

  listen(port?: number, callback?: () => void) {
    const hostPort = port || 5000;
    return this.server.listen.apply(this.server, [hostPort, callback]);
  }

  async close() {
    return await new Promise((resolve) => this.server.close(resolve));
  }
}

export default slow;
export const app = new slow();
