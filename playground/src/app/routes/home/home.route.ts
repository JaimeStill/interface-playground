import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Links } from '../../app.routes';

@Component({
    selector: 'home-route',
    standalone: true,
    templateUrl: 'home.route.html',
    styleUrl: 'home.route.css',
    imports: [RouterLink]
})
export class HomeRoute {
    links = Links
        .filter(x => x.label !== 'Home');
}