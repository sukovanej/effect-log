import { Effect, LogLevel, Logger, pipe } from "effect";

export const exampleEffect = pipe(
  Effect.log("Hello world"),
  Effect.tap(() =>
    pipe(Effect.logDebug("Im here"), Effect.withLogSpan("span-label-1")),
  ),
  Effect.tap(() =>
    pipe(
      Effect.logError("Something's super fishy"),
      Effect.annotateLogs("life", "is awesome"),
      Effect.annotateLogs("sometimes", "not that awesome"),
    ),
  ),
  Effect.annotateLogs("rootCause", "milan"),
  Effect.tap(() =>
    pipe(Effect.logFatal("Don Quijote"), Effect.annotateLogs("likes", "fp-ts")),
  ),
  Effect.tap(() => Effect.logTrace("Hello darkness my old friend")),
  Effect.tap(() =>
    Effect.logWarning("Lesnek is a beautiful surname, is it not?"),
  ),
  Effect.annotateLogs("myName", "Earl"),
  Effect.tap(() => Effect.logDebug("Sooo sad, not annotations for me")),
  Effect.tap(() => Effect.logTrace("Never Gonna Give You Up")),
  Effect.provide(Logger.minimumLogLevel(LogLevel.All)),
  Effect.flatMap(() => Effect.dieMessage("Aaaand it's gone")),
  Effect.tapErrorCause(Effect.logError),
);
