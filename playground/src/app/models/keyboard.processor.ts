import { computed, effect, signal } from '@angular/core';
import { toObservable } from '@angular/core/rxjs-interop';
import { fromEvent, Subscription } from 'rxjs';
import { debounceTime, filter, map } from 'rxjs/operators';
import { Shortcut } from './shortcut';

export class KeyboardProcessor {
    private subs: Subscription[] = [];
    private chord = signal<boolean>(false);

    dialog: HTMLDialogElement = document.createElement('dialog');

    buffer = signal<boolean>(false);
    history = signal<KeyboardEvent[]>([]);
    latest = signal<Shortcut | null>(null);
    shortcuts = signal<Map<string, Shortcut>>(new Map<string, Shortcut>());

    hasHistory = computed(() => this.history().length > 0);

    constructor(element: HTMLElement) {
        this.initDialog(element);

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

                        if (this.buffer()) {
                            this.dialog.close();
                        }

                        this.buffer.set(false);
                        this.history.update((history) => [...history, event]);

                        const shortcut = this.shortcuts().get(event.key);

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

        effect(() => {
            const ul = document.createElement('ul');

            for (let shortcut of this.shortcuts()) {
                const li = document.createElement('li');
                li.innerHTML = `<kbd>${shortcut[1].key}</kbd> - ${shortcut[1].name}`;
                ul.appendChild(li);
            }

            this.dialog.replaceChildren(ul);
        });

        effect(() => {
            if (this.buffer())
                this.dialog.showModal();
        })
    }

    private initDialog(element: HTMLElement) {
        element.appendChild(this.dialog);
    }

    destroy() {
        this.subs.forEach((sub: Subscription) => sub.unsubscribe());
    }

    set(shortcut: Shortcut) {
        if (this.shortcuts().has(shortcut.key))
            throw new Error(`Shortcut ${shortcut.key} is already in use`);

        this.shortcuts.update((map) => map.set(shortcut.key, shortcut));
    }

    remove(shortcut: Shortcut) {
        if (this.shortcuts().has(shortcut.key))
            this.shortcuts.update((map) => {
                map.delete(shortcut.key);
                return map;
            });
    }
}