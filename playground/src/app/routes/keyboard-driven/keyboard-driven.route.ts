import { Component, computed, effect, ElementRef, OnDestroy, OnInit, signal, viewChild } from '@angular/core';
import { KeyboardProcessor, Photo, Photos } from '../../models';
import { AppService } from '../../services';
import { fromEvent, Subscription } from 'rxjs';
import { debounceTime, distinctUntilChanged, map } from 'rxjs/operators';

@Component({
    selector: 'keyboard-driven.route',
    standalone: true,
    templateUrl: 'keyboard-driven.route.html',
    styleUrl: 'keyboard-driven.route.css'
})
export class KeyboardDrivenRoute implements OnInit, OnDestroy {
    private subs: Subscription[] = [];
    keys: KeyboardProcessor;
    bar = viewChild.required<ElementRef<HTMLInputElement>>('bar');
    photos = signal<Photo[]>(Photos);

    constructor(
        app: AppService
    ) {
        this.keys = new KeyboardProcessor(app.body()!.nativeElement);
    }

    ngOnInit(): void {
        this.keys.set({
            key: 's',
            name: 'Search',
            description: 'Search for values',
            trigger: (() => this.bar().nativeElement.focus()).bind(this)
        });

        this.subs.push(
            fromEvent(this.bar().nativeElement, 'input')
                .pipe(
                    distinctUntilChanged(),
                    debounceTime(150),
                    map((event: Event) => (<HTMLInputElement>event.target).value)
                ).subscribe((value: string) => {
                    this.photos.update(() =>
                        value.length > 0
                            ? Photos.filter((photo) =>
                                photo.author
                                    .toLocaleLowerCase()
                                    .includes(
                                        value.toLocaleLowerCase()
                                    )
                            )
                            : Photos
                    )
                })
        );
    }

    ngOnDestroy(): void {
        this.keys.destroy();
        this.subs.forEach(x => x.unsubscribe());
    }
}