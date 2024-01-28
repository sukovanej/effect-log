import { List, LogSpan } from "effect";
import * as Cause from "effect/Cause";
import * as FiberId from "effect/FiberId";
import { pipe } from "effect/Function";
import * as HashMap from "effect/HashMap";
import * as Layer from "effect/Layer";
import * as LogLevel from "effect/LogLevel";
import * as Logger from "effect/Logger";
import * as ReadonlyArray from "effect/ReadonlyArray";

import { serializeUnknown } from "effect-log/internal";

const RESET = "\x1b[0m";
const BOLD = "\x1b[1m";
const DIM = "\x1b[2m";
const ITALIC = "\x1b[3m";

const RED = "\x1b[31m";
const GREEN = "\x1b[32m";
const YELLOW = "\x1b[33m";
const BLUE = "\x1b[34m";
const WHITE = "\x1b[37m";

const SEVERITY_TO_COLOR: Record<LogLevel.LogLevel["_tag"], string> = {
  All: WHITE,
  None: WHITE,
  Info: GREEN,
  Debug: BLUE,
  Error: RED,
  Fatal: BOLD + RED,
  Trace: DIM + WHITE,
  Warning: YELLOW,
};

export interface PrettyLoggerOptions {
  showFiberId: boolean;
  showTime: boolean;
  showSpans: boolean;
}

const defaultOptions: PrettyLoggerOptions = {
  showFiberId: true,
  showTime: true,
  showSpans: true,
};

const createTimeString = (date: Date) => {
  const hoursText = date.getHours().toString().padStart(2, "0");
  const minutesText = date.getMinutes().toString().padStart(2, "0");
  const secondsText = date.getSeconds().toString().padStart(2, "0");
  return `${YELLOW}${hoursText}:${minutesText}:${secondsText}${RESET}`;
};

const createCauseMessage = (cause: Cause.Cause<unknown>) => {
  if (cause._tag === "Empty") {
    return "";
  }
  return Cause.pretty(cause);
};

const createLogLevelString = (logLevel: LogLevel.LogLevel) => {
  const logLevelColor = SEVERITY_TO_COLOR[logLevel._tag];
  const logLevelText = logLevel.label.padEnd(5, " ");
  return `${logLevelColor}${logLevelText}${RESET}`;
};

const messageText = (message: unknown) => {
  if (message === undefined) {
    return `${DIM}undefined${RESET}`;
  } else if (message === null) {
    return `${DIM}null${RESET}`;
  } else if (message === "") {
    return `${DIM}<empty message>${RESET}`;
  }
  return serializeUnknown(message);
};

const createText = (message: unknown, cause: Cause.Cause<unknown>) =>
  pipe(
    [createCauseMessage(cause), messageText(message)],
    ReadonlyArray.filter((i) => i !== ""),
    ReadonlyArray.join(" "),
  );

const createSpanText = (spans: List.List<LogSpan.LogSpan>) => {
  if (List.isNil(spans)) {
    return "";
  }

  const text = List.reduce(
    List.unsafeTail(spans),
    List.unsafeHead(spans).label,
    (acc, span) => `${acc} -> ${span.label}`,
  );

  return ` ${DIM}${ITALIC}${text}${RESET}`;
};

export const make = (options?: Partial<PrettyLoggerOptions>) =>
  Logger.make(
    ({ fiberId, logLevel, message, annotations, cause, date, spans }) => {
      const _options = { ...defaultOptions, ...options };

      const logLevelStr = createLogLevelString(logLevel);
      const timeText = _options.showTime ? `${createTimeString(date)} ` : "";
      const fiberText = _options.showFiberId
        ? `${DIM}(Fiber ${FiberId.threadName(fiberId)})${RESET} `
        : "";

      const text = createText(message, cause);

      const spansText = _options.showSpans ? createSpanText(spans) : "";

      console.log(`${timeText}${fiberText}${logLevelStr}${spansText} ${text}`);

      if (!HashMap.isEmpty(annotations)) {
        const text = HashMap.reduce(
          annotations,
          [] as string[],
          (acc, v, k) => [
            ...acc,
            `${WHITE}"${k}"${RESET}: ${serializeUnknown(v)}`,
          ],
        );
        console.log(`ᐉ ${DIM}{${RESET} ${text.join(", ")} ${DIM}}${RESET}`);
      }
    },
  );

export const layer: (
  options?: Partial<PrettyLoggerOptions>,
) => Layer.Layer<never, never, never> = (options) =>
  Logger.replace(Logger.defaultLogger, make(options));
