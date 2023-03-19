import Route from "./Route.js";
import SlowResponse from "./Response.js";
import SlowRequest from "./Request.js";
import { methods } from "../utils/const.js";
declare class Router {
    routes: {
        [key: string]: Route;
    };
    private _static;
    constructor();
    route: (method: (typeof methods)[number], path: string, callback: (req: SlowRequest, res: SlowResponse) => void) => void;
    handle(req: SlowRequest, res: SlowResponse): void;
    static(path: string): void;
    private parseUrl;
    private getMethod;
    private parsePath;
    private getPlaceholderPath;
    private getWildcardPath;
}
export default Router;
//# sourceMappingURL=Router.d.ts.map