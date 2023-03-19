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
  placeholder: string | undefined;
  constructor(path: string) {
    this.path = path;
    this.methods = {};
    this.placeholder = this.parsePlaceholderPath(path);
  }

  parsePlaceholderPath(path: string) {
    const pathArr = path.split("/");
    for (let i = 0; i < pathArr.length; i++) {
      if (pathArr[i].startsWith(":")) {
        return pathArr[i].substring(1);
      }
    }
  }
}

export default Route;
