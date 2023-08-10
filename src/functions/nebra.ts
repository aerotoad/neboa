import { Nebra } from "../classes/nebra";
import { DatabaseOptions } from "../types/database-options";

export function nebra(path: string, options?: DatabaseOptions) {
  return new Nebra(path, options);
}
