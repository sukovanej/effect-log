import * as Log from "effect-log";

import { pipe } from "@effect/data/Function";
import * as Effect from "@effect/io/Effect";

import { exampleEffect } from "./example-logging-effect";

pipe(exampleEffect, Effect.provideLayer(Log.setPrettyLogger), Effect.runSync);
