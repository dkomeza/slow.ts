import { METHODS } from "http";

export const methods = METHODS.map((method: string) => {
  return method.toLowerCase();
});

// Path: src/utils/const.ts
