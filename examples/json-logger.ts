import { pipe } from "@effect/data/Function";
import * as Effect from "@effect/io/Effect";

import * as Log from "../src";

pipe(
  Effect.log("Hello world"),
  Effect.logAnnotate("my-tag", "value"),
  Effect.provideLayer(Log.useJsonLogger()),
  Effect.runSync,
);
