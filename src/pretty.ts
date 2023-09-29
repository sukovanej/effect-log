import {
  Cause,
  FiberId,
  HashMap,
  Layer,
  LogLevel,
  Logger,
  ReadonlyArray,
  pipe,
} from "effect";

import { serializeUnknown } from "effect-log/internal";

const RESET = "\x1b[0m";
const DIM = "\x1b[2m";
const BOLD = "\x1b[1m";
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
}

const defaultOptions: PrettyLoggerOptions = {
  showFiberId: true,
  showTime: true,
};

const createTimeString = (date: Date) => {
  const hoursText = date.getHours().toString().padStart(2, "0");
  const minutesText = date.getMinutes().toString().padStart(2, "0");
  const secondsText = date.getSeconds().toString().padStart(2, "0");
  return `${YELLOW}${hoursText}:${minutesText}:${secondsText}${RESET}`;
};

const createCauseMessage = (cause: Cause.Cause<unknown>) =>
  `Cause(${cause._tag}): ${cause.toJSON()}`;

const createLogLevelString = (logLevel: LogLevel.LogLevel) => {
  const logLevelColor = SEVERITY_TO_COLOR[logLevel._tag];
  const logLevelText = logLevel.label.padEnd(5, " ");
  return `${logLevelColor}${logLevelText}${RESET}`;
};

const createText = (message: unknown, cause: Cause.Cause<unknown>) =>
  pipe(
    [createCauseMessage(cause), serializeUnknown(message)],
    ReadonlyArray.filter((i) => i !== ""),
    ReadonlyArray.join(" "),
  );

export const makePrettyLogger = (options?: Partial<PrettyLoggerOptions>) =>
  Logger.make(({ fiberId, logLevel, message, annotations, cause, date }) => {
    const _options = { ...defaultOptions, ...options };

    const logLevelStr = createLogLevelString(logLevel);
    const timeText = _options.showTime ? `${createTimeString(date)} ` : "";
    const fiberText = _options?.showFiberId
      ? `${DIM}(Fiber ${FiberId.threadName(fiberId)})${RESET} `
      : "";

    const text = createText(message, cause);

    console.log(`${timeText}${fiberText}${logLevelStr} ${text}`);

    if (!HashMap.isEmpty(annotations)) {
      const text = HashMap.reduce(annotations, [] as string[], (acc, v, k) => [
        ...acc,
        `${WHITE}"${k}"${RESET}: "${v}"`,
      ]);
      console.log(`ᐉ ${DIM}{${RESET} ${text.join(", ")} ${DIM}}${RESET}`);
    }
  });

export const setPrettyLogger: (
  options?: Partial<PrettyLoggerOptions>,
) => Layer.Layer<never, never, never> = (options) =>
  Logger.replace(Logger.defaultLogger, makePrettyLogger(options));
