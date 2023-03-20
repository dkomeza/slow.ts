import Route from "./Route.js";
import * as fs from "fs";
class Router {
    constructor() {
        this.routes = {};
        this._static = {};
        this.route = (method, path, callback) => {
            const parsedPath = this.parsePath(path);
            const route = new Route(path);
            route.methods[method] = callback;
            this.routes[parsedPath] = route;
        };
    }
    handle(req, res) {
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
                }
                else {
                    const content = fs.readFileSync(file);
                    res.write(content);
                    res.end();
                }
            }
        }
        res.end("404");
    }
    static(path) {
        this._static[path] = path;
    }
    parseUrl(req) {
        const url = decodeURIComponent(req.url || "");
        const path = url.split("?")[0];
        return path;
    }
    getMethod(req) {
        var _a;
        return ((_a = req.method) === null || _a === void 0 ? void 0 : _a.toLowerCase()) || "get";
    }
    parsePath(path) {
        const pathArr = path.split("/");
        const parsedPathArr = pathArr.map((p) => {
            if (p.startsWith(":")) {
                return "***";
            }
            return p;
        });
        return parsedPathArr.join("/");
    }
    getPlaceholderPath(path) {
        const placeholderPath = path
            .split("/")
            .slice(0, -1)
            .join("/")
            .concat("/***");
        return placeholderPath;
    }
    getWildcardPath(path) {
        const wildcardPath = path.split("/").slice(0, -1).join("/").concat("/*");
        return wildcardPath;
    }
}
export default Router;
