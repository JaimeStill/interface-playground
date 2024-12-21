import {
    HomeRoute,
    KeyboardDrivenRoute
} from './routes';

import { Routes } from '@angular/router';

export const routes: Routes = [
    {
        path: 'keyboard-driven',
        component: KeyboardDrivenRoute
    },
    {
        path: '',
        pathMatch: 'full',
        component: HomeRoute
    },
    {
        path: '**',
        pathMatch: 'full',
        redirectTo: ''
    }
];

export const Links = [
    {
        label: 'Home',
        url: '/'
    },
    {
        label: 'Keyboard-Driven Interface',
        url: '/keyboard-driven'
    }
]