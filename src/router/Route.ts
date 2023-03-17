import { IncomingMessage } from "http";
import SlowResponse from "./Response";

interface callback {
  (req: IncomingMessage, res: SlowResponse): void;
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
