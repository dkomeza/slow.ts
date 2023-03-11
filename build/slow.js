import http from "http";
import Router from "./router/router.js";
import * as CONST from "./utils/const.js";
class slow {
    constructor() {
        this.router = new Router();
        CONST.methods.forEach((method) => {
            this[method] = function (path, args) {
                this.registerPath(path, method, args);
            };
        });
    }
    registerPath(path, method, args) {
        const route = this.router.route(path);
        // route[method].apply(route, args);
        return this;
    }
    handle(req, res) {
        this.router.handle(req, res);
    }
    listen(port, callback) {
        const server = http.createServer(this.handle.bind(this));
        server.on;
        return server.listen.apply(server, [port, callback]);
    }
}
export default slow;
