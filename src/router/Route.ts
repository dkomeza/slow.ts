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
  priority: number[]
  placeholders: string[] = [];
  constructor(path: string, priority: number[]) {
    this.path = path;
    this.priority = priority
    this.methods = {};
    this.parsePlaceholderPath(path);
  }

  parsePlaceholderPath(path: string) {
    const pathArr = path.split("/");
    for (let i = 0; i < pathArr.length; i++) {
      if (pathArr[i].startsWith(":")) {
        this.placeholders.push(pathArr[i].substring(1));
      }
    }
  }
}

export default Route;
