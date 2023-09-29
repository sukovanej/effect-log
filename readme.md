# effect-log

Logging batteris for effect-ts.

## [Pretty logger](examples/pretty-logger.ts)

Use `Log.pretty` to get the pretty logger or `Log.setPrettyLogger` to
obtain a layer replacing the default logger. Optionally, use the argument
to configure what information gets propagated to the output.

```typescript
import { Effect, pipe } from "effect";
import { Log } from "effect-log";

import { exampleEffect } from "./example-logging-effect";

const PrettyLogger = Log.setPrettyLogger({
  showFiberId: false,
  showTime: false,
});

pipe(exampleEffect, Effect.provide(PrettyLogger), Effect.runSync);
```

![pretty](assets/pretty.png)

## [JSON logger](examples/json-logger.ts)

Use `Log.json()` to get the pretty logger or `Log.setJsonLogger()` to
obtain a layer replacing the default loggger. Optionally, specify a name
of the message field by the input argument.

```typescript
import { Effect, pipe } from "effect";
import { Log } from "effect-log";

import { exampleEffect } from "./example-logging-effect";

const JsonLogger = Log.setJsonLogger();

pipe(exampleEffect, Effect.provide(JsonLogger), Effect.runSync);
```

![json](assets/json.png)
