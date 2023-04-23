import * as Logger from "@effect/io/Logger";

import { setLogger } from "./setLogger";

export * from "./pretty";
export * from "./json";

/** Exported for convinience */
export const setNoneLogger = setLogger(Logger.none());

/** Exported for convinience */
export const setDefaultLogger = setLogger(Logger.defaultLogger);
