import * as HashMap from "@effect/data/HashMap";
import { threadName } from "@effect/io/Fiber/Id";
import * as Logger from "@effect/io/Logger";

import { serializeUnknown } from "effect-log/internal";

export const json = (messageField?: string) =>
  Logger.make(({ fiberId, logLevel, message, annotations }) => {
    const tags: Record<string, unknown> = HashMap.reduce(
      annotations,
      {},
      (acc, v, k) => ({
        ...acc,
        [k]: v,
      }),
    );

    tags["logLevel"] = logLevel.label;
    tags[messageField ?? "message"] = serializeUnknown(message);
    tags["fiberId"] = threadName(fiberId);

    console.log(JSON.stringify(tags));
  });
