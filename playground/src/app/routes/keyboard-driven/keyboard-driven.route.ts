import { Component, computed, effect, ElementRef, OnDestroy, OnInit, signal, viewChild } from '@angular/core';
import { KeyboardProcessor, Photo, Photos } from '../../models';
import { AppService } from '../../services';
import { fromEvent } from 'rxjs';
import { debounceTime, distinctUntilChanged, map } from 'rxjs/operators';

@Component({
    selector: 'keyboard-driven.route',
    standalone: true,
    templateUrl: 'keyboard-driven.route.html',
    styleUrl: 'keyboard-driven.route.css'
})
export class KeyboardDrivenRoute implements OnInit, OnDestroy {
    private reset: () => void = () => { };
    keys: KeyboardProcessor;
    bar = viewChild.required<ElementRef<HTMLInputElement>>('bar');
    photos = signal<Photo[]>(Photos);

    constructor(
        app: AppService
    ) {
        this.keys = new KeyboardProcessor(app.body()!.nativeElement);

        this.keys.set({
            key: 's',
            name: 'Search',
            description: 'Search for values',
            trigger: this.search.bind(this)
        });
    }

    ngOnInit(): void {
        fromEvent(this.bar().nativeElement, 'blur')
            .subscribe({
                next: () => {
                    console.log('lost focus');
                    this.reset();
                }
            })
    }

    ngOnDestroy(): void {
        this.keys.destroy();
    }

    search(): void {
        this.bar().nativeElement.focus();

        const sub = fromEvent(this.bar().nativeElement, 'input')
            .pipe(
                distinctUntilChanged(),
                debounceTime(150),
                map((event: Event) => (<HTMLInputElement>event.target).value)
            ).subscribe((value: string) => {
                this.photos.update(() => {
                    console.log(value);
                    return value.length > 0
                        ? Photos.filter((photo) => {
                            console.log('photo filter:', photo);
                            return photo.author.toLocaleLowerCase().includes(value.toLocaleLowerCase())
                        })
                        : Photos
                })
            });

        this.reset = () => {
            sub.unsubscribe();
            this.bar().nativeElement.value = '';
            this.photos.update(() => Photos);
        }
    }
}