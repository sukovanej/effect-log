import { Effect, pipe } from "effect"
import { PrettyLogger } from "effect-log"

import { exampleEffect } from "./example-logging-effect.js"

pipe(exampleEffect, Effect.provide(PrettyLogger.layer()), Effect.runSync)
