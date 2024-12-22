import { computed, signal } from '@angular/core';
import { toObservable } from '@angular/core/rxjs-interop';
import { fromEvent, Subscription } from 'rxjs';
import { debounceTime, filter, map } from 'rxjs/operators';
import { Shortcut } from './shortcut';

export class KeyboardProcessor {
    private subs: Subscription[] = [];
    private chord = signal<boolean>(false);

    shortcuts: Map<string, Shortcut> = new Map<string, Shortcut>();

    buffer = signal<boolean>(false);
    history = signal<KeyboardEvent[]>([]);
    latest = signal<Shortcut | null>(null);
    hasHistory = computed(() => this.history().length > 0);

    constructor(element: HTMLElement) {
        const buffer = toObservable(this.chord)
            .pipe(
                debounceTime(500),
                filter(chord => chord)
            )
            .subscribe(() => this.buffer.set(true));

        const history = fromEvent(element, 'keydown')
            .pipe(
                map(e => <KeyboardEvent>e)
            )
            .subscribe({
                next: (event: KeyboardEvent) => {
                    if (event.ctrlKey && event.key === 'k') {
                        event.preventDefault();
                        this.chord.set(true);
                    } else if (this.chord()) {
                        event.preventDefault();
                        this.chord.set(false);
                        this.buffer.set(false);
                        this.history.update((history) => [...history, event]);

                        const shortcut = this.shortcuts.get(event.key);

                        if (shortcut) {
                            this.latest.set(shortcut);
                            shortcut.trigger();
                        }
                    }
                }
            });

        this.subs.push(
            buffer,
            history
        );
    }

    destroy() {
        this.subs.forEach((sub: Subscription) => sub.unsubscribe());
    }

    set(shortcut: Shortcut) {
        if (this.shortcuts.has(shortcut.key))
            throw new Error(`Shortcut ${shortcut.key} is already in use`);

        this.shortcuts.set(shortcut.key, shortcut);
    }

    remove(shortcut: Shortcut) {
        if (this.shortcuts.has(shortcut.key))
            this.shortcuts.delete(shortcut.key);
    }
}