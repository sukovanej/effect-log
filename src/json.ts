import * as HashMap from "@effect/data/HashMap";
import { threadName } from "@effect/io/FiberId";
import type * as Layer from "@effect/io/Layer";
import * as Logger from "@effect/io/Logger";

import { serializeUnknown } from "effect-log/internal";

export const json = (messageField?: string) =>
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
    tags["fiberId"] = threadName(fiberId);

    if (cause._tag !== "Empty") {
      tags["cause"] = cause;
    }

    console.log(JSON.stringify(tags));
  });

export const setJsonLogger: (
  messageFields?: string,
) => Layer.Layer<never, never, never> = (messageField) =>
  Logger.replace(Logger.defaultLogger, json(messageField));
