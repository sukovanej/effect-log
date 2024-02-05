import { Effect, Logger, LogLevel, pipe } from "effect"

export const exampleEffect = pipe(
  Effect.log("Hello world"),
  Effect.tap(() => pipe(Effect.logDebug("Im here"), Effect.withLogSpan("span-label-1"))),
  Effect.tap(() =>
    pipe(
      Effect.logError("Something's super fishy"),
      Effect.annotateLogs("life", "is awesome"),
      Effect.annotateLogs("sometimes", "not that awesome"),
      Effect.annotateLogs("json", { value: 1, another: { hello: [3, 2, 1] } })
    )
  ),
  Effect.withLogSpan("mySpan"),
  Effect.annotateLogs("rootCause", "milan"),
  Effect.tap(() => pipe(Effect.logFatal("Don Quijote"), Effect.annotateLogs("likes", "fp-ts"))),
  Effect.tap(() => Effect.logTrace("Hello darkness my old friend")),
  Effect.tap(() => Effect.logWarning("Lesnek is a beautiful surname, is it not?")),
  Effect.withLogSpan("stuff"),
  Effect.annotateLogs("myName", "Earl"),
  Effect.tap(() => Effect.logDebug("Sooo sad, not annotations for me")),
  Effect.tap(() => Effect.logTrace("Never Gonna Give You Up")),
  Effect.provide(Logger.minimumLogLevel(LogLevel.All)),
  Effect.tapErrorCause(Effect.logError),
  Effect.flatMap(() => pipe(Effect.log(""), Effect.annotateLogs("likes", "fp-ts"))),
  Effect.withSpan("span-label-3"),
  Effect.flatMap(() => pipe(Effect.log(undefined), Effect.annotateLogs("likes", "fp-ts"))),
  Effect.withLogSpan("helloWorld"),
  Effect.flatMap(() => pipe(Effect.log(null), Effect.annotateLogs("likes", "fp-ts"))),
  Effect.flatMap(() => Effect.dieMessage("Aaaand it's gone"))
)
