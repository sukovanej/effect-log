import * as Debug from "@effect/data/Debug";
import * as HashSet from "@effect/data/HashSet";
import * as Effect from "@effect/io/Effect";
import * as FiberRef from "@effect/io/FiberRef";
import * as Layer from "@effect/io/Layer";
import * as Logger from "@effect/io/Logger";

export const overrideLoggersBy = Debug.untracedMethod(
  () =>
    <A>(logger: Logger.Logger<string, A>): Layer.Layer<never, never, never> =>
      Layer.scopedDiscard(
        Effect.locallyScopedWith(FiberRef.currentLoggers, () =>
          HashSet.make(logger),
        ),
      ),
);
