import Route from "./Route.js";
import SlowResponse from "./Response.js";
import SlowRequest from "./Request.js";

import * as fs from "fs";

import { methods } from "../utils/const.js";

interface use {
  (path: string, callback: (req: SlowRequest, res: SlowResponse) => void): void;
}

class Router {
  routes: { [key: string]: Route } = {};
  private _static: { [key: string]: string } = {};

  constructor() {}

  route = (
    method: typeof methods[number],
    path: string,
    callback: (req: SlowRequest, res: SlowResponse) => void
  ) => {
    const parsedPath = this.parsePath(path);
    const route = new Route(path);
    route.methods[method] = callback;
    this.routes[parsedPath] = route;
  };

  handle(req: SlowRequest, res: SlowResponse) {
    const path = this.parseUrl(req);
    const method = this.getMethod(req);
    const route = this.routes[path];
    // match exact path
    if (route) {
      const callback = route.methods[method];
      if (callback) {
        callback(req, res);
        return;
      }
    }
    // match placeholder path
    const placeholderPath = this.getPlaceholderPath(path);
    const placeholderRoute = this.routes[placeholderPath];
    if (placeholderRoute) {
      if (placeholderRoute.placeholder) {
        req.params[placeholderRoute.placeholder] = path.split("/").pop();
      }
      const callback = placeholderRoute.methods[method];
      if (callback) {
        callback(req, res);
        return;
      }
    }

    // match wildcard path
    let tempPath = path.split("/");
    while (tempPath.length > 1) {
      const wildcardPath = this.getWildcardPath(tempPath.join("/"));
      console.log(wildcardPath);
      const wildcardRoute = this.routes[wildcardPath];
      if (wildcardRoute) {
        const callback = wildcardRoute.methods[method];
        if (callback) {
          callback(req, res);
          return;
        }
      }
      tempPath = tempPath.slice(0, -1);
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
          } 
        } else {
          const content = fs.readFileSync(file);
          res.write(content);
          res.end();
        }
      }
    }
    res.end("404");
  }

  static(path: string) {
    this._static[path] = path;
  }

  private parseUrl(req: SlowRequest) {
    const url = decodeURIComponent(req.url || "");
    const path = url.split("?")[0];
    return path;
  }

  private getMethod(req: SlowRequest): string {
    return req.method?.toLowerCase() || "get";
  }

  private parsePath(path: string) {
    const pathArr = path.split("/");
    const parsedPathArr = pathArr.map((p) => {
      if (p.startsWith(":")) {
        return "***";
      }
      return p;
    });
    return parsedPathArr.join("/");
  }

  private getPlaceholderPath(path: string) {
    const placeholderPath = path
      .split("/")
      .slice(0, -1)
      .join("/")
      .concat("/***");
    return placeholderPath;
  }

  private getWildcardPath(path: string) {
    const wildcardPath = path.split("/").slice(0, -1).join("/").concat("/*");
    return wildcardPath;
  }
}

export default Router;
