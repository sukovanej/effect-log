import { pipe } from "@effect/data/Function";
import * as Effect from "@effect/io/Effect";
import * as Logger from "@effect/io/Logger";

import * as Log from "../src";
import { exampleEffect } from "./example-loggin-effect";

pipe(
  exampleEffect,
  Effect.provideLayer(
    Logger.replace(Logger.defaultLogger, Log.json()),
  ),
  Effect.runSync,
);
