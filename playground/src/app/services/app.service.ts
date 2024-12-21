import {
    ElementRef,
    Injectable,
    signal
} from '@angular/core';

@Injectable()
export class AppService {
    body = signal<ElementRef<HTMLBodyElement> | null>(null);
}