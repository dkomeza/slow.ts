import Route from "./Route.js";
import SlowResponse from "./Response.js";
import SlowRequest from "./Request.js";

import * as fs from "fs";

import { methods, fileMimeTypes } from "../utils/const.js";

interface Middleware {
  callback: (req: SlowRequest, res: SlowResponse, next: () => void) => void;
  priority: number[];
}
class Router {
  routes: { [key: string]: Route } = {};
  middleware: { [key: string]: Middleware } = {};
  private _static: {
    [key: string]: {
      path: string;
      middleware?: (
        req: SlowRequest,
        res: SlowResponse,
        next: () => void
      ) => void;
    };
  } = {};

  route = (
    method: (typeof methods)[number],
    path: string,
    callback: (req: SlowRequest, res: SlowResponse) => void
  ) => {
    const { regex, priority } = this.createRegex(path);
    if (this.routes[regex]) {
      this.routes[regex].methods[method] = callback;
      return;
    }
    const route = new Route(path, priority);
    route.methods[method] = callback;
    this.routes[regex] = route;
  };

  handle(req: SlowRequest, res: SlowResponse) {
    const path = this.parseUrl(req);
    const method = this.getMethod(req);

    const regex = new RegExp("(\\.){2,}", "g");
    const match = path.match(regex);
    if (match) {
      res.statusCode = 403;
      res.end("403");
      return;
    }

    const keys = Object.keys(this.routes);
    const matchedRoutes: { route: Route; regex: RegExp }[] = [];
    for (const key of keys) {
      const regex = new RegExp(key) ?? false;
      if (path.match(regex)) {
        const route = this.routes[key];
        matchedRoutes.push({ route, regex });
      }
    }

    const Route = this.checkPriority(matchedRoutes, 0, method) ?? false;
    const Middleware = this.checkMiddlewarePriority(
      this.matchMiddleware(path) ?? [],
      0
    );
    if (Route) {
      const { route, regex } = Route;
      const callback = route.methods[method] ?? false;
      if (route.placeholders.length > 0) {
        route.placeholders.forEach((placeholder, index) => {
          const match = path.match(regex);
          if (match && match[index + 1]) {
            req.params[placeholder] = match[index + 1];
          }
        });
      }

      if (Middleware?.callback) {
        Middleware.callback(req, res, () => {
          if (callback) {
            callback(req, res);
          }
        });
        return;
      } else if (callback) {
        callback(req, res);
        return;
      }
    }

    // match static path
    const staticPath = this.getStaticFile(path) ?? false;
    if (staticPath) {
      const { path, mime, middleware } = staticPath;
      if (middleware) {
        middleware(req, res, () => {
          const content = fs.readFileSync(path);
          res.writeHead(200, { "content-type": mime });
          res.write(content);
          res.end();
        });
        return;
      } else {
        const content = fs.readFileSync(path);
        res.writeHead(200, { "content-type": mime });
        res.write(content);
        res.end();
        return;
      }
    }
    res.statusCode = 404;
    res.end("404");
  }

  static(
    reqPath: string,
    path: string,
    middleware?: (req: SlowRequest, res: SlowResponse, next: () => void) => void
  ) {
    if (reqPath[reqPath.length - 1] === "/") {
      reqPath = reqPath.slice(0, reqPath.length - 1);
    }

    if (path[path.length - 1] === "/") {
      path = path.slice(0, path.length - 1);
    }

    this._static[reqPath] = {
      path,
      middleware,
    };
  }

  registerMiddleware(
    path: string,
    callback: (req: SlowRequest, res: SlowResponse, next: () => void) => void
  ) {
    const { regex, priority } = this.createRegex(path);
    this.middleware[regex] = {
      callback,
      priority,
    };
  }

  private matchMiddleware(path: string): Middleware[] | undefined {
    const matchedMiddleware = Object.keys(this.middleware).filter((key) => {
      const regex = new RegExp(key);
      return path.match(regex);
    });
    if (matchedMiddleware.length === 0) {
      return undefined;
    }
    const middleware = matchedMiddleware.map((key) => {
      return this.middleware[key];
    });
    return middleware;
  }

  private checkPriority(
    routes: { route: Route; regex: RegExp }[],
    currentSortingIndex = 0,
    method: string
  ): { route: Route; regex: RegExp } | undefined {
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
        return route;
      }
    }
    return this.checkPriority(
      routesWithSamePriority,
      currentSortingIndex + 1,
      method
    );
  }

  private checkMiddlewarePriority(
    middleware: Middleware[],
    currentSortingIndex = 0
  ): Middleware | undefined {
    if (middleware.length === 0) {
      return undefined;
    }
    if (middleware.length === 1) {
      return middleware[0];
    }
    const sortedRoutes = middleware.sort((a, b) => {
      return a.priority[currentSortingIndex] - b.priority[currentSortingIndex];
    });

    const currentLowestPriority = sortedRoutes[0].priority[currentSortingIndex];
    const routesWithSamePriority = sortedRoutes.filter(
      (middleware) =>
        middleware.priority[currentSortingIndex] === currentLowestPriority
    );
    if (routesWithSamePriority.length === 1) {
      const middleware = routesWithSamePriority[0];
      return middleware;
    }
    return this.checkMiddlewarePriority(
      routesWithSamePriority,
      currentSortingIndex + 1
    );
  }

  private parseUrl(req: SlowRequest) {
    const url = decodeURIComponent(req.url ?? "");
    const path = url.split("?")[0];
    return path;
  }

  private getMethod(req: SlowRequest): string {
    return (req.method ?? "get").toLowerCase();
  }

  private createRegex(path: string): { regex: string; priority: number[] } {
    const pathArr = path.split("/").filter((p) => p);
    if (pathArr.length === 0) {
      return { regex: "^/$", priority: [0] };
    }
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

  private getStaticFile(_path: string):
    | {
        path: string;
        mime: string;
        middleware?: (
          req: SlowRequest,
          res: SlowResponse,
          next: () => void
        ) => void;
      }
    | undefined {
    for (const _static of Object.keys(this._static)) {
      const { path, middleware } = this._static[_static];

      const regex = new RegExp(`^${_static}`);
      if (!_path.match(regex)) {
        continue;
      }
      const file = _path.replace(regex, path);
      if (fs.existsSync(file)) {
        if (fs.statSync(file).isDirectory()) {
          if (fs.existsSync(_path + "/index.html")) {
            const ext = ".html";
            const mime = fileMimeTypes[ext] ?? "text/plain";
            return { path: file + "/index.html", mime, middleware };
          }
        } else {
          const ext = ".".concat(
            file.split(".").pop() ?? ""
          ) as keyof typeof fileMimeTypes;
          const mime = fileMimeTypes[ext] ?? "text/plain";
          return { path: file, mime, middleware };
        }
      }
    }
    return;
  }
}

export default Router;
