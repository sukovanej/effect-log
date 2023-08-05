import * as HashMap from "@effect/data/HashMap";
import { threadName } from "@effect/io/Fiber/Id";
import type * as Layer from "@effect/io/Layer";
import * as Logger from "@effect/io/Logger";
import type * as LoggerLevel from "@effect/io/Logger/Level";

import { serializeUnknown } from "effect-log/internal";

const RESET = "\x1b[0m";
const DIM = "\x1b[2m";
const BOLD = "\x1b[1m";
const RED = "\x1b[31m";
const GREEN = "\x1b[32m";
const YELLOW = "\x1b[33m";
const BLUE = "\x1b[34m";
const WHITE = "\x1b[37m";

const SEVERITY_TO_COLOR: Record<LoggerLevel.LogLevel["_tag"], string> = {
  All: WHITE,
  None: WHITE,
  Info: GREEN,
  Debug: BLUE,
  Error: RED,
  Fatal: BOLD + RED,
  Trace: DIM + WHITE,
  Warning: YELLOW,
};

interface PrettyLoggerOptions {
  showFiberId: boolean;
  showTime: boolean;
}

const defaultOptions: PrettyLoggerOptions = {
  showFiberId: true,
  showTime: true,
};

const createTimeString = () => {
  const now = new Date();
  const hoursText = now.getHours().toString().padStart(2, "0");
  const minutesText = now.getMinutes().toString().padStart(2, "0");
  const secondsText = now.getSeconds().toString().padStart(2, "0");
  return `${YELLOW}${hoursText}:${minutesText}:${secondsText}${RESET}`;
};

const createLogLevelString = (logLevel: LoggerLevel.LogLevel) => {
  const logLevelColor = SEVERITY_TO_COLOR[logLevel._tag];
  const logLevelText = logLevel.label.padEnd(5, " ");
  return `${logLevelColor}${logLevelText}${RESET}`;
};

export const pretty = (options?: Partial<PrettyLoggerOptions>) =>
  Logger.make(({ fiberId, logLevel, message, annotations }) => {
    const _options = { ...defaultOptions, ...options };

    const logLevelStr = createLogLevelString(logLevel);
    const timeText = _options.showTime ? `${createTimeString()} ` : "";
    const fiberText = _options?.showFiberId
      ? `${DIM}(Fiber ${threadName(fiberId)})${RESET} `
      : "";

    const text = serializeUnknown(message);

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
  Logger.replace(Logger.defaultLogger, pretty(options));
