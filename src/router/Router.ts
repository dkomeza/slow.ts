import { IncomingMessage, ServerResponse } from "http";
import Route from "./Route.js";
import SlowResponse from "./Response.js";

class Router {
  private routes: { [key: string]: Route } = {};
  constructor() {}

  route(path: string) {
    const route = new Route(path);
    this.routes[path] = route;
    return route;
  }

  apply() {}

  handle(req: IncomingMessage, res: SlowResponse) {
    const path = this.parseUrl(req);
    const route = this.routes[path];
    if (route) {
      route.handle(req, res);
    } else {
      res.statusCode = 404;
      res.end("Not Found");
    }
  }

  parseUrl(req: IncomingMessage) {
    const url = decodeURIComponent(req.url || "");
    const path = url.split("?")[0];
    return path;
  }
}

export default Router;
