# Keyboard-Driven Interface

<kbd>Ctrl + K</kbd> should serve as the starting chord of a compound keyboard shortcut system where, after pressing the starting chord, the next key activates the shortcut.

> [!NOTE]
> See [Visual Studio Code - Keyboard Rules](https://code.visualstudio.com/docs/getstarted/keybindings#_keyboard-rules) for a description of chords.

For instance:

* <kbd>Ctrl + K S</kbd> - Search
* <kbd>Ctrl + K N</kbd> - Navigate
* etc.

The system should leverage RxJS [**`fromEvent`**](https://rxjs.dev/api/index/function/fromEvent) to link a [**`keydown`**](https://developer.mozilla.org/en-US/docs/Web/API/Element/keydown_event) event on the **`<body>`** tag that links to a shortcut service that handles the events.

> [!NOTE]
> See [Key values for keyboard events](https://developer.mozilla.org/en-US/docs/Web/API/UI_Events/Keyboard_event_key_values)

The service should be [**`signal`**]()-based and retain context of the components the user is interfacing with. For instance, when components come into view, they register listeners that intercept and handle shortcut events from the main pipeline signal.

If the user presses the <kbd>Ctrl + K</kbd> chord and waits a short period (perhaps **`150ms`**), then a [**modal dialog**](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/dialog#creating_a_modal_dialog) will open with a list of available shortcuts.

The service should keep track of the defined shortcuts for the app, as well as user-configured overrides for default values.

