import { Effect, pipe } from "effect";
import { JsonLogger } from "effect-log";

import { exampleEffect } from "./example-logging-effect";

pipe(exampleEffect, Effect.provide(JsonLogger.layer()), Effect.runSync);
