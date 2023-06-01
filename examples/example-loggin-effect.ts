import { pipe } from "@effect/data/Function";
import * as Effect from "@effect/io/Effect";
import * as Logger from "@effect/io/Logger";
import * as LoggerLevel from "@effect/io/Logger/Level";

export const exampleEffect = pipe(
  Effect.log("Hello world"),
  Effect.tap(() =>
    pipe(Effect.logDebug("Im here"), Effect.logSpan("span-label-1")),
  ),
  Effect.tap(() =>
    pipe(
      Effect.logError("Something's super fishy"),
      Effect.logAnnotate("life", "is awesome"),
      Effect.logAnnotate("sometimes", "not that awesome"),
    ),
  ),
  Effect.logAnnotate("rootCause", "milan"),
  Effect.tap(() =>
    pipe(Effect.logFatal("Don Quijote"), Effect.logAnnotate("likes", "fp-ts")),
  ),
  Effect.tap(() => Effect.logTrace("Hello darkness my old friend")),
  Effect.tap(() =>
    Effect.logWarning("Lesnek is a beautiful surname, is it not?"),
  ),
  Effect.logAnnotate("myName", "Earl"),
  Effect.tap(() => Effect.logDebug("Sooo sad, not annotations for me")),
  Effect.tap(() => Effect.logTrace("Never Gonna Give You Up")),
  Effect.provideSomeLayer(Logger.minimumLogLevel(LoggerLevel.All)),
);
