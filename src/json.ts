import * as FiberId from "effect/FiberId";
import * as HashMap from "effect/HashMap";
import * as Layer from "effect/Layer";
import * as Logger from "effect/Logger";

import { serializeUnknown } from "effect-log/internal";

export const makeJsonLogger = (messageField?: string) =>
  Logger.make(({ fiberId, logLevel, message, annotations, cause, date }) => {
    const tags: Record<string, unknown> = HashMap.reduce(
      annotations,
      {},
      (acc, v, k) => ({
        ...acc,
        [k]: v,
      }),
    );

    tags["date"] = date;
    tags["logLevel"] = logLevel.label;
    tags[messageField ?? "message"] = serializeUnknown(message);
    tags["fiberId"] = FiberId.threadName(fiberId);

    if (cause._tag !== "Empty") {
      tags["cause"] = cause;
    }

    console.log(JSON.stringify(tags));
  });

export const setJsonLogger: (
  messageFields?: string,
) => Layer.Layer<never, never, never> = (messageField) =>
  Logger.replace(Logger.defaultLogger, makeJsonLogger(messageField));
