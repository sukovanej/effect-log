import * as HashSet from "@effect/data/HashSet";
import * as Effect from "@effect/io/Effect";
import * as FiberRef from "@effect/io/FiberRef";
import * as Layer from "@effect/io/Layer";
import * as Logger from "@effect/io/Logger";

/** Create a layer which sets a logger */
export const setLogger = <A>(
  logger: Logger.Logger<string, A>,
): Layer.Layer<never, never, never> =>
  Layer.scopedDiscard(
    Effect.locallyScopedWith(FiberRef.currentLoggers, () =>
      HashSet.make(logger),
    ),
  );
