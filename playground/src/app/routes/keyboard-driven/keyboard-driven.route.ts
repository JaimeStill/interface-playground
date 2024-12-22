import { Component, ElementRef, OnDestroy, viewChild } from '@angular/core';
import { KeyboardProcessor } from '../../models';
import { AppService } from '../../services';

@Component({
    selector: 'keyboard-driven.route',
    standalone: true,
    templateUrl: 'keyboard-driven.route.html',
    styleUrl: 'keyboard-driven.route.css'
})
export class KeyboardDrivenRoute implements OnDestroy {
    keys: KeyboardProcessor;
    search = viewChild.required<ElementRef<HTMLInputElement>>('search');

    constructor(
        app: AppService
    ) {
        this.keys = new KeyboardProcessor(app.body()!.nativeElement);

        this.keys.set({
            key: 's',
            name: 'Search',
            description: 'Search for values',
            trigger: this.focusSearch.bind(this)
        });

    }

    ngOnDestroy(): void {
        this.keys.destroy();
    }

    focusSearch(): void {
        this.search().nativeElement.focus();
    }
}