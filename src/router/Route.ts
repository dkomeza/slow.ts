import SlowResponse from "./Response";
import SlowRequest from "./Request";

interface callback {
  (req: SlowRequest, res: SlowResponse): void;
}

class Route implements Route {
  path: string;
  methods: {
    [key: string]: callback;
  };
  constructor(path: string) {
    this.path = path;
    this.methods = {};
  }
}

export default Route;
