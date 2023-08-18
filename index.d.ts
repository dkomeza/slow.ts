/// <reference types="node" />

import slow, { app } from "./build/slow";
import SlowRequest from "./build/router/Request";
import SlowResponse from "./build/router/Response";

export default slow;
export { app };
export type { SlowRequest, SlowResponse };
