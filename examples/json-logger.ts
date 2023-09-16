import { Effect, pipe } from "effect";
import { Log } from "effect-log";

import { exampleEffect } from "./example-logging-effect";

pipe(
  exampleEffect,
  Effect.provideSomeLayer(Log.setJsonLogger()),
  Effect.runSync,
);
