# Dev Log

Current Focus: [**keyboard-driven interface**](./designs/keyboard-driven-interface.md)

## Infrastructure

- [**`App`**](./playground/src/app/app.ts) initializes the [**`AppService`**](./playground/src/app/services/app.service.ts) with the **`<body>`** element.
- [**`app.html`**](./playground/src/app/app.html) ensures that routes are only rendered whenever **`AppService.body`** is not null.
- [**`KeyboardDrivenRoute`**](./playground/src/app/routes/keyboard-driven/keyboard-driven.route.ts) initializes an instance of [**`KeyboardProcessor`**](./playground/src/app/models/keyboard.processor.ts) and reacts to keyboard events in its [**template**](./playground/src/app/routes/keyboard-driven/keyboard-driven.route.html):
    - If the **`KeyboardProcessor.buffer`** signal becomes true, render available shortcuts.
    - Whenever the **`KeyboardProcessor.shortcut`** signal emits, update the most recently executed shortcut.
    - Log all of the executed shortcuts using the **`KeyboardProcessor.shortcuts`** signal.

## Tasks

- [ ] Build out a dialog modal interface for listing available shortcuts when **`buffer`** is true.
- [ ] Build out a way of defining shortcuts and registering actions to execute whenever they are encountered.
    - Registration should happend directly from the element that will be triggered by the shortcut.