# effect-log

Logging batteris for effect-ts.

## [Pretty logger](examples/pretty-logger.ts)

Use `PrettyLogger.make` to create the pretty logger or `PrettyLogger.layer` to
obtain a layer replacing the default logger. Optionally, use the argument
to configure what information gets propagated to the output.

```typescript
import { Effect, pipe } from "effect";
import { PrettyLog } from "effect-log";

import { exampleEffect } from "./example-logging-effect";

const logger = PrettyLog.layer({
  showFiberId: false,
  showTime: false,
});

pipe(exampleEffect, Effect.provide(logger), Effect.runSync);
```

![pretty](assets/pretty.png)

## [JSON logger](examples/json-logger.ts)

Use `JsonLogger.make` to create the pretty logger or `JsonLogger.layer` to
obtain a layer replacing the default loggger. Optionally, specify a name
of the message field by the input argument.

```typescript
import { Effect, pipe } from "effect";
import { JsonLogger } from "effect-log";

import { exampleEffect } from "./example-logging-effect";

const logger = JsonLogger.layer();

pipe(exampleEffect, Effect.provide(logger), Effect.runSync);
```

![json](assets/json.png)
