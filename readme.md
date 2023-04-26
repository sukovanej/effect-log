# effect-log

Logging batteris for effect-ts.

## [Pretty logger](examples/pretty-logger.ts)

Use `Log.pretty` to get the pretty logger.

```typescript
import * as Log from "effect-log";

import { pipe } from "@effect/data/Function";
import * as Effect from "@effect/io/Effect";
import * as Logger from "@effect/io/Logger";

const effectWithPrettylogger = pipe(
  someEffect,
  Effect.provideLayer(Logger.replace(Logger.defaultLogger, Log.pretty)),
  Effect.runSync,
);
```

![pretty](assets/pretty.png)

## [JSON logger](examples/json-logger.ts)

Use `Log.json()` to get the pretty logger. Optionally, the function accepts
a string argument specifying a name of the message field.

```typescript
import * as Log from "effect-log";

import { pipe } from "@effect/data/Function";
import * as Effect from "@effect/io/Effect";
import * as Logger from "@effect/io/Logger";

const effectWithJsonLogger = pipe(
  someEffect,
  Effect.provideLayer(Logger.replace(Logger.defaultLogger, Log.json())),
  Effect.runSync,
);
```

![json](assets/json.png)
