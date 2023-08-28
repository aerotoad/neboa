import { Neboa } from "../classes/neboa";
import { DatabaseOptions } from "../types/database-options";

export function neboa(path: string, options?: DatabaseOptions) {
  return new Neboa(path, options);
}
