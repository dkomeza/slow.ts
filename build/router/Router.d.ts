import Route from "./Route.js";
import SlowResponse from "./Response.js";
import SlowRequest from "./Request.js";
declare class Router {
    private routes;
    constructor();
    route(path: string): Route;
    apply(): void;
    handle(req: SlowRequest, res: SlowResponse): void;
    parseUrl(req: SlowRequest): string;
    getMethod(req: SlowRequest): string;
}
export default Router;
//# sourceMappingURL=Router.d.ts.map