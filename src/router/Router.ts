import Route from "./Route.js";
import SlowResponse from "./Response.js";
import SlowRequest from "./Request.js";

class Router {
  private routes: { [key: string]: Route } = {};
  constructor() {}

  route(path: string) {
    const route = new Route(path);
    this.routes[path] = route;
    return route;
  }

  apply() {}

  handle(req: SlowRequest, res: SlowResponse) {
    const path = this.parseUrl(req);
    const method = this.getMethod(req);
    const route = this.routes[path];
    if (route) {
      const callback = route.methods[method];
      if (callback) {
        callback(req, res);
      } else {
        res.statusCode = 404;
        res.end("Not Found");
      }
    } else {
      res.statusCode = 404;
      res.end("Not Found");
    }
  }

  parseUrl(req: SlowRequest) {
    const url = decodeURIComponent(req.url || "");
    const path = url.split("?")[0];
    return path;
  }

  getMethod(req: SlowRequest): string {
    return req.method?.toLowerCase() || "get";
  }
}

export default Router;
