import { Component, ElementRef, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { AppService } from './services';

@Component({
    selector: '[app-root]',
    templateUrl: 'app.html',
    imports: [RouterOutlet],
    providers: [AppService]
})
export class App implements OnInit {
    constructor(
        private host: ElementRef,
        public app: AppService
    ) { }

    ngOnInit(): void {
        this.app.body.set(this.host);
    }
}
