import { pipe } from "@effect/data/Function";
import * as Effect from "@effect/io/Effect";

import * as Log from "../src";
import { exampleEffect } from "./example-loggin-effect";

pipe(exampleEffect, Effect.provideLayer(Log.useJsonLogger()), Effect.runSync);
