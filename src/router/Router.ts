import Route from "./Route.js";
import SlowResponse from "./Response.js";
import SlowRequest from "./Request.js";

import * as fs from "fs";

import { methods } from "../utils/const.js";

class Router {
  routes: { [key: string]: Route } = {};
  private _static: { [key: string]: string } = {};

  route = (
    method: typeof methods[number],
    path: string,
    callback: (req: SlowRequest, res: SlowResponse) => void
  ) => {
    const { regex, priority } = this.createRegex(path);
    const route = new Route(path, priority);
    route.methods[method] = callback;
    this.routes[regex] = route;
  };

  handle(req: SlowRequest, res: SlowResponse) {
    const path = this.parseUrl(req);
    const method = this.getMethod(req);
    const keys = Object.keys(this.routes);
    const matchedRoutes: { route: Route; regex: RegExp; key: string }[] = [];
    for (const key of keys) {
      const regex = new RegExp(key) ?? false;
      if (path.match(regex)) {
        const route = this.routes[key];
        matchedRoutes.push({ route, regex, key });
      }
    }

    const Route = this.checkPriority(matchedRoutes, 0, method) ?? false;
    if (Route) {
      const { route, key, regex } = Route;
      console.log(route.path);
      const callback = route.methods[method] ?? false;
      if (route.placeholders.length > 0) {
        route.placeholders.forEach((placeholder, index) => {
          req.params[placeholder] = path.match(regex)![index + 1];
        });
      }
      if (callback) {
        callback(req, res);
        return;
      }
    }

    // match static path
    for (const path of Object.keys(this._static)) {
      const file = "./" + path + req.url;
      if (fs.existsSync(file)) {
        if (fs.statSync(file).isDirectory()) {
          if (fs.existsSync(file + "/index.html")) {
            const content = fs.readFileSync(file + "/index.html");
            res.write(content);
            res.end();
            return;
          } else {
            break;
          }
        } else {
          const content = fs.readFileSync(file);
          res.write(content);
          res.end();
          return;
        }
      }
    }
    res.statusCode = 404;
    res.end("404");
  }

  static(path: string) {
    this._static[path] = path;
  }

  private checkPriority(
    routes: { route: Route; regex: RegExp; key: string }[],
    currentSortingIndex = 0,
    method: string
  ): { route: Route; regex: RegExp; key: string } | undefined {
    if (routes.length === 0) {
      return undefined;
    }
    if (routes.length === 1) {
      return routes[0];
    }
    const sortedRoutes = routes.sort((a, b) => {
      return (
        a.route.priority[currentSortingIndex] -
        b.route.priority[currentSortingIndex]
      );
    });

    const currentLowestPriority =
      sortedRoutes[0].route.priority[currentSortingIndex];
    const routesWithSamePriority = sortedRoutes.filter(
      (route) =>
        route.route.priority[currentSortingIndex] === currentLowestPriority
    );
    if (routesWithSamePriority.length === 1) {
      const route = routesWithSamePriority[0];
      if (route.route.methods[method]) {
        console.log(route);
        return route;
      }
    }
    return this.checkPriority(
      routesWithSamePriority,
      currentSortingIndex + 1,
      method
    );
  }

  private parseUrl(req: SlowRequest) {
    const url = decodeURIComponent(req.url!);
    const path = url.split("?")[0];
    return path;
  }

  private getMethod(req: SlowRequest): string {
    return req.method!.toLowerCase();
  }

  private createRegex(path: string): { regex: string; priority: number[] } {
    const pathArr = path.split("/").filter((p) => p);
    const priority: number[] = [];
    let regex = "^";
    pathArr.forEach((p, index) => {
      if (p.startsWith(":")) {
        regex += "\\/((?:[^/])+)";
        priority[index] = 1;
      } else if (p === "*") {
        regex += "\\/(\\S+)";
        priority[index] = 2;
      } else {
        regex += `\\/${p}`;
        priority[index] = 0;
      }
    });
    if (!path.endsWith("*")) {
      regex += "$";
    }
    return { regex, priority };
  }
}

export default Router;
