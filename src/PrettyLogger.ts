/**
 * Pretty logger.
 *
 * @since 1.0.0
 */
import * as Array from "effect/Array"
import * as Cause from "effect/Cause"
import * as FiberId from "effect/FiberId"
import { identity, pipe } from "effect/Function"
import * as HashMap from "effect/HashMap"
import type * as Layer from "effect/Layer"
import * as List from "effect/List"
import * as Logger from "effect/Logger"
import type * as LogLevel from "effect/LogLevel"
import type * as LogSpan from "effect/LogSpan"

import { serializeUnknown } from "./internal/serializeUnkown.js"

/** @internal */
const SEVERITY_TO_COLOR: Record<
  LogLevel.LogLevel["_tag"],
  (c: ColorService) => (s: string) => string
> = {
  All: (c: ColorService) => c.white,
  None: (c: ColorService) => c.white,
  Info: (c: ColorService) => c.green,
  Debug: (c: ColorService) => c.blue,
  Error: (c: ColorService) => c.red,
  Fatal: (c: ColorService) => c.boldRed,
  Trace: (c: ColorService) => c.dimWhite,
  Warning: (c: ColorService) => c.yellow
}

/** @internal */
interface ColorService {
  bold(text: string): string
  dim(text: string): string
  italic(text: string): string

  red(text: string): string
  green(text: string): string
  yellow(text: string): string
  blue(text: string): string
  white(text: string): string

  dimItalic(text: string): string
  dimWhite(text: string): string
  boldRed(text: string): string
}

const RESET = "\x1b[0m"
const BOLD = "\x1b[1m"
const DIM = "\x1b[2m"
const ITALIC = "\x1b[3m"

const RED = "\x1b[31m"
const GREEN = "\x1b[32m"
const YELLOW = "\x1b[33m"
const BLUE = "\x1b[34m"
const WHITE = "\x1b[37m"

/** @internal */
const enabledColorService: ColorService = {
  bold: (text: string) => `${BOLD}${text}${RESET}`,
  dim: (text: string) => `${DIM}${text}${RESET}`,
  italic: (text: string) => `${ITALIC}${text}${RESET}`,

  red: (text: string) => `${RED}${text}${RESET}`,
  green: (text: string) => `${GREEN}${text}${RESET}`,
  yellow: (text: string) => `${YELLOW}${text}${RESET}`,
  blue: (text: string) => `${BLUE}${text}${RESET}`,
  white: (text: string) => `${WHITE}${text}${RESET}`,

  dimItalic: (text: string) => `${DIM}${ITALIC}${text}${RESET}`,
  dimWhite: (text: string) => `${DIM}${WHITE}${text}${RESET}`,
  boldRed: (text: string) => `${BOLD}${RED}${text}${RESET}`
}

/** @internal */
const disabledColorService: ColorService = {
  bold: identity,
  dim: identity,
  italic: identity,

  red: identity,
  green: identity,
  yellow: identity,
  blue: identity,
  white: identity,

  dimItalic: identity,
  dimWhite: identity,
  boldRed: identity
}

/**
 * @category models
 * @since 1.0.0
 */
export interface Options {
  showFiberId: boolean
  showTime: boolean
  showSpans: boolean
  enableColors: boolean
}

/** @internal */
const defaultOptions: Options = {
  showFiberId: true,
  showTime: true,
  showSpans: true,
  enableColors: true
}

/** @internal */
const createTimeString = (colorService: ColorService, date: Date) => {
  const hoursText = date.getHours().toString().padStart(2, "0")
  const minutesText = date.getMinutes().toString().padStart(2, "0")
  const secondsText = date.getSeconds().toString().padStart(2, "0")
  const millisText = date.getMilliseconds().toString().padStart(3, "0")
  return colorService.yellow(
    `${hoursText}:${minutesText}:${secondsText}.${millisText}`
  )
}

/** @internal */
const createCauseMessage = (cause: Cause.Cause<unknown>) => {
  if (cause._tag === "Empty") {
    return ""
  }
  return Cause.pretty(cause)
}

/** @internal */
const createLogLevelString = (
  colorService: ColorService,
  logLevel: LogLevel.LogLevel
) => {
  const logLevelColor = SEVERITY_TO_COLOR[logLevel._tag](colorService)
  return logLevelColor(logLevel.label.padEnd(5, " "))
}

/** @internal */
const messageText = (colorService: ColorService, message: unknown): string => {
  if (message === undefined) {
    return colorService.dim("undefined")
  } else if (message === null) {
    return colorService.dim("null")
  } else if (message === "") {
    return colorService.dim("<empty message>")
  }
  return serializeUnknown(message)
}

/** @internal */
const createText = (
  colorService: ColorService,
  message: ReadonlyArray<unknown>,
  cause: Cause.Cause<unknown>
) =>
  pipe(
    [createCauseMessage(cause), messageText(colorService, message.join(" "))],
    Array.filter((i) => i !== ""),
    Array.join(" ")
  )

/** @internal */
const createSpanText = (
  colorService: ColorService,
  spans: List.List<LogSpan.LogSpan>
) => {
  if (List.isNil(spans)) {
    return ""
  }

  const text = List.reduce(
    List.unsafeTail(spans),
    List.unsafeHead(spans).label,
    (acc, span) => `${span.label} -> ${acc}`
  )

  return ` ${colorService.dimItalic(text)}`
}

/**
 * @category constructors
 * @since 1.0.0
 */
export const make = (
  options?: Partial<Options>
): Logger.Logger<unknown, void> =>
  Logger.make(
    ({ annotations, cause, date, fiberId, logLevel, message, spans }) => {
      const _options = { ...defaultOptions, ...options }
      const colorService = _options.enableColors
        ? enabledColorService
        : disabledColorService

      const logLevelStr = createLogLevelString(colorService, logLevel)
      const timeText = _options.showTime
        ? `${createTimeString(colorService, date)} `
        : ""
      const fiberText = _options.showFiberId
        ? colorService.dim(`(Fiber ${FiberId.threadName(fiberId)}) `)
        : ""

      const text = createText(colorService, Array.ensure(message), cause)

      const spansText = _options.showSpans
        ? createSpanText(colorService, spans)
        : ""

      console.log(`${timeText}${fiberText}${logLevelStr}${spansText} ${text}`)

      if (!HashMap.isEmpty(annotations)) {
        const text = HashMap.reduce(
          annotations,
          [] as Array<string>,
          (acc, v, k) => [
            ...acc,
            colorService.white(`"${k}"`) + `: ${serializeUnknown(v)}`
          ]
        )
        console.log(
          `ᐉ ${colorService.dim("{")} ${text.join(", ")} ${colorService.dim("}")}`
        )
      }
    }
  )

/**
 * @category layers
 * @since 1.0.0
 */
export const layer: (
  options?: Partial<Options>
) => Layer.Layer<never, never, never> = (options) => Logger.replace(Logger.defaultLogger, make(options))
