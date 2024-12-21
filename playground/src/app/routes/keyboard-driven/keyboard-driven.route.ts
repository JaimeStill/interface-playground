import { Component, OnDestroy } from '@angular/core';
import { KeyboardProcessor } from '../../models';
import { AppService } from '../../services';

@Component({
    selector: 'keyboard-driven.route',
    standalone: true,
    templateUrl: 'keyboard-driven.route.html'
})
export class KeyboardDrivenRoute implements OnDestroy {
    keys: KeyboardProcessor;
    constructor(
        app: AppService
    ) {
        this.keys = new KeyboardProcessor(app.body()!.nativeElement);
    }

    ngOnDestroy(): void {
        this.keys.destroy();
    }
}