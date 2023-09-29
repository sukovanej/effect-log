import { Effect, pipe } from "effect";
import { Log } from "effect-log";

import { exampleEffect } from "./example-logging-effect";

pipe(exampleEffect, Effect.provide(Log.setJsonLogger()), Effect.runSync);
