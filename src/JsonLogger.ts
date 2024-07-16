/**
 * JSON logger.
 *
 * @since 1.0.0
 */
import * as Array from "effect/Array"
import * as FiberId from "effect/FiberId"
import * as HashMap from "effect/HashMap"
import type * as Layer from "effect/Layer"
import * as List from "effect/List"
import * as Logger from "effect/Logger"
import type * as LogLevel from "effect/LogLevel"

import { serializeUnknown } from "./internal/serializeUnkown.js"

/**
 * @category models
 * @since 1.0.0
 */
export interface Options {
  showFiberId: boolean
  showTime: boolean
  showSpans: boolean
  messageField: string
  logLevelField: string
  logLevelFormat: "lowercase" | "uppercase" | "capitalized"
}

/** @internal */
const defaultOptions: Options = {
  showFiberId: true,
  showTime: true,
  showSpans: true,
  messageField: "message",
  logLevelField: "level",
  logLevelFormat: "capitalized"
}

const capitalize = (string: string) => string.charAt(0).toUpperCase() + string.slice(1).toLowerCase()

/** @internal */
const formatLogLevel: (format: Options["logLevelFormat"]) => (logLevel: LogLevel.LogLevel) => string = (format) => {
  if (format === "lowercase") {
    return (logLevel) => logLevel.label.toLowerCase()
  } else if (format === "uppercase") {
    return (logLevel) => logLevel.label.toUpperCase()
  }
  return (logLevel) => capitalize(logLevel.label)
}

/**
 * @category constructors
 * @since 1.0.0
 */
export const make: (options?: Partial<Options>) => Logger.Logger<unknown, void> = (options) => {
  const _options = { ...defaultOptions, ...options }
  const _formatLogLevel = formatLogLevel(_options.logLevelFormat)

  return Logger.make(
    ({ annotations, cause, date, fiberId, logLevel, message, spans }) => {
      const tags: Record<string, unknown> = HashMap.reduce(
        annotations,
        {},
        (acc, v, k) => ({
          ...acc,
          [k]: v
        })
      )

      if (_options.showTime) {
        tags["date"] = date
      }
      tags[_options.logLevelField] = _formatLogLevel(logLevel)
      tags[_options.messageField] = Array.ensure(message).map(serializeUnknown).join(" ")

      if (_options.showFiberId) {
        tags["fiberId"] = FiberId.threadName(fiberId)
      }

      if (_options.showSpans && List.isCons(spans)) {
        tags["spans"] = List.toArray(spans).map((span) => span.label)
      }

      if (cause._tag !== "Empty") {
        tags["cause"] = cause
      }

      console.log(JSON.stringify(tags))
    }
  )
}

/**
 * @category layers
 * @since 1.0.0
 */
export const layer: (
  options?: Partial<Options>
) => Layer.Layer<never, never, never> = (options) => Logger.replace(Logger.defaultLogger, make(options ?? {}))
