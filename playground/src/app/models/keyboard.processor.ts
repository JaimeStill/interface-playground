import { computed, signal } from '@angular/core';
import { toObservable } from '@angular/core/rxjs-interop';
import { fromEvent, Subscription } from 'rxjs';
import { debounceTime, filter, map } from 'rxjs/operators';

export class KeyboardProcessor {
    private subs: Subscription[] = [];
    private chord = signal<boolean>(false);
    buffer = signal<boolean>(false);
    shortcuts = signal<KeyboardEvent[]>([]);
    shortcut = computed(() => this.shortcuts().at(-1));

    constructor(element: HTMLElement) {
        const buffer = toObservable(this.chord)
            .pipe(
                debounceTime(500),
                filter(chord => chord)
            )
            .subscribe(() => this.buffer.set(true));

        const shortcuts = fromEvent(element, 'keydown')
            .pipe(
                map(e => <KeyboardEvent>e)
            )
            .subscribe({
                next: (event: KeyboardEvent) => {
                    if (event.ctrlKey && event.key === 'k') {
                        event.preventDefault();
                        this.chord.set(true);
                    } else if (this.chord()) {
                        this.chord.set(false);
                        this.buffer.set(false);
                        this.shortcuts.update((shortcuts) => [...shortcuts, event]);
                    }
                }
            });

        this.subs.push(
            buffer,
            shortcuts
        );
    }

    destroy() {
        this.subs.forEach((sub: Subscription) => sub.unsubscribe());
    }
}