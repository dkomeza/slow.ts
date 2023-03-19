import SlowResponse from "./Response";
import SlowRequest from "./Request";
interface callback {
    (req: SlowRequest, res: SlowResponse): void;
}
declare class Route implements Route {
    path: string;
    methods: {
        [key: string]: callback;
    };
    constructor(path: string);
}
export default Route;
//# sourceMappingURL=Route.d.ts.map