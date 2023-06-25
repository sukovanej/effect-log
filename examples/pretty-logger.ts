import * as Log from "effect-log";

import { pipe } from "@effect/data/Function";
import * as Effect from "@effect/io/Effect";
import * as Logger from "@effect/io/Logger";

import { exampleEffect } from "./example-loggin-effect";

pipe(
  exampleEffect,
  Effect.provideLayer(Logger.replace(Logger.defaultLogger, Log.pretty)),
  Effect.runSync,
);
