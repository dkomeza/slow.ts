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
    placeholder: string | undefined;
    constructor(path: string);
    parsePlaceholderPath(path: string): string | undefined;
}
export default Route;
//# sourceMappingURL=Route.d.ts.map