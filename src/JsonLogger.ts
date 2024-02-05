/**
 * JSON logger.
 *
 * @since 1.0.0
 */
import { List } from "effect"
import * as FiberId from "effect/FiberId"
import * as HashMap from "effect/HashMap"
import type * as Layer from "effect/Layer"
import * as Logger from "effect/Logger"

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
}

/** @internal */
const defaultOptions: Options = {
  showFiberId: true,
  showTime: true,
  showSpans: true,
  messageField: "message"
}

/**
 * @category constructors
 * @since 1.0.0
 */
export const make = (options?: Partial<Options>) =>
  Logger.make(
    ({ annotations, cause, date, fiberId, logLevel, message, spans }) => {
      const _options = { ...defaultOptions, ...options }

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
      tags["logLevel"] = logLevel.label
      tags[_options.messageField] = serializeUnknown(message)

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

/**
 * @category layers
 * @since 1.0.0
 */
export const layer: (
  options?: Partial<Options>
) => Layer.Layer<never, never, never> = (options) => Logger.replace(Logger.defaultLogger, make(options ?? {}))
