# effect-log

Logging batteris for effect-ts.

## [Pretty logger](examples/pretty-logger.ts)

Use `Log.pretty` to get the pretty logger or `Log.usePrettyLogger` to
get a layer with the logger.

```typescript
import * as Log from "effect-log";

import { pipe } from "@effect/data/Function";
import * as Effect from "@effect/io/Effect";

const effectWithPrettylogger = pipe(
  someEffect,
  Effect.provideLayer(Log.usePrettyLogger),
  Effect.runSync,
);
```

![pretty](assets/pretty.png)

## [JSON logger](examples/json-logger.ts)

Use `Log.json()` to get the pretty logger or `Log.useJsonLogger()` to
get a layer with the logger. Optionally, both combinators accepts
a string argument specifying a name of the message field.

```typescript
import * as Log from "effect-log";

import { pipe } from "@effect/data/Function";
import * as Effect from "@effect/io/Effect";

const effectWithJsonLogger = pipe(
  someEffect,
  Effect.provideLayer(Log.useJsonLogger()),
  Effect.runSync,
);
```

![json](assets/json.png)
