import * as HashMap from "@effect/data/HashMap";
import { threadName } from "@effect/io/Fiber/Id";
import * as Logger from "@effect/io/Logger";

export const json = (messageField?: string) =>
  Logger.make(
    (fiberId, logLevel, message, _cause, _context, _spans, annotations) => {
      const tags: Record<string, unknown> = HashMap.reduceWithIndex(
        annotations,
        {},
        (acc, v, k) => ({
          ...acc,
          [k]: v,
        }),
      );

      tags["logLevel"] = logLevel.label;
      tags[messageField ?? "message"] = message;
      tags["fiberId"] = threadName(fiberId);

      console.log(JSON.stringify(tags));
    },
  );
