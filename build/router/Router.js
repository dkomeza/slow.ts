import Route from "./Route.js";
class Router {
    constructor() {
        this.routes = {};
    }
    route(path) {
        const route = new Route(path);
        this.routes[path] = route;
        return route;
    }
    apply() { }
    handle(req, res) {
        const path = this.parseUrl(req);
        const method = this.getMethod(req);
        const route = this.routes[path];
        if (route) {
            const callback = route.methods[method];
            if (callback) {
                callback(req, res);
            }
            else {
                res.statusCode = 404;
                res.end("Not Found");
            }
        }
        else {
            res.statusCode = 404;
            res.end("Not Found");
        }
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
}
export default Router;
