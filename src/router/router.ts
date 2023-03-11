import { IncomingMessage, ServerResponse } from "http";
import Route from "./route.js";

class Router {
  private routes: { [key: string]: Route } = {};
  constructor() {}
  
  route(path: string) {
    const route = new Route(path);
    this.routes[path] = route;
    return route;
  }

  apply() {}

  handle(req: IncomingMessage, res: ServerResponse) {
    const path = this.parseUrl(req);
    const route = this.routes[path];
    if (route) {
      route.handle(req, res); 
    }
  }

  parseUrl(req: IncomingMessage) {
    const url = decodeURIComponent(req.url || "");
    return url;
  }
}

export default Router;
