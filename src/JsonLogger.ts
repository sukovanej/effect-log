import { List } from "effect";
import * as FiberId from "effect/FiberId";
import * as HashMap from "effect/HashMap";
import * as Layer from "effect/Layer";
import * as Logger from "effect/Logger";

import { serializeUnknown } from "effect-log/internal";

export interface Options {
  showFiberId: boolean;
  showTime: boolean;
  showSpans: boolean;
  messageField: string;
}

const defaultOptions: Options = {
  showFiberId: true,
  showTime: true,
  showSpans: true,
  messageField: "message",
};

export const make = (options?: Partial<Options>) =>
  Logger.make(
    ({ fiberId, logLevel, message, annotations, cause, date, spans }) => {
      const _options = { ...defaultOptions, ...options };

      const tags: Record<string, unknown> = HashMap.reduce(
        annotations,
        {},
        (acc, v, k) => ({
          ...acc,
          [k]: v,
        }),
      );

      if (_options.showTime) {
        tags["date"] = date;
      }
      tags["logLevel"] = logLevel.label;
      tags[_options.messageField] = serializeUnknown(message);

      if (_options.showFiberId) {
        tags["fiberId"] = FiberId.threadName(fiberId);
      }

      if (_options.showSpans && List.isCons(spans)) {
        tags["spans"] = List.toArray(spans).map((span) => span.label);
      }

      if (cause._tag !== "Empty") {
        tags["cause"] = cause;
      }

      console.log(JSON.stringify(tags));
    },
  );

export const layer: (
  options?: Partial<Options>,
) => Layer.Layer<never, never, never> = (options) =>
  Logger.replace(Logger.defaultLogger, make(options ?? {}));
