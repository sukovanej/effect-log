import { Effect, pipe } from "effect";
import { PrettyLogger } from "effect-log";

import { exampleEffect } from "./example-logging-effect";

pipe(
  exampleEffect,
  Effect.provide(PrettyLogger.layer({ showFiberId: false, showTime: false })),
  Effect.runSync,
);
