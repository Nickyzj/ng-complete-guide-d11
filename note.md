# Changing Pages With Routing

app.modules.ts
```javascript
import { Routes, RouterModule } from '@angular/router';

const appRoutes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'users', component: UsersComponent },
  { path: 'servers', component: ServersComponent }
]

imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    RouterModule.forRoot(appRoutes)
  ],
```

app.component.html
```html
<router-outlet></router-outlet>
```
---
## routerLink
```html
<li role="presentation" class="active"><a routerLink="/">Home</a></li>
        <li role="presentation"><a routerLink="/servers">Servers</a></li>
        <li role="presentation"><a [routerLink]="['/users']">Users</a></li>
```
---
## routerLinkActiveOptions
```html
<li 
          role="presentation" 
          routerLinkActive="active"
          [routerLinkActiveOptions]="{exact: true}"><a routerLink="/">Home</a></li
```
---
## Navigating programmatically
home.component.html
```html
<button class="btn btn-primary" (click)="onLoadServers()">Load Servers</button>
```

home.component.ts
```javascript
import { Router } from '@angular/router';

constructor(private router: Router) { }

onLoadServers() {
    this.router.navigate(['/servers']);
  }
```
---
user.compoment.html
```html
<a [routerLink]="['/users', 10, 'Anna']">Load Anna (10)</a>
```
user.component.ts
```javascript
import { ActivatedRoute, Params } from '@angular/router';

ngOnInit() {
    this.user = {
      id: this.route.snapshot.params['id'],
      name: this.route.snapshot.params['name']
    };
    this.route.params.subscribe(
      (params: Params) => {
        this.user.id = params['id'];
        this.user.name = params['name'];
      }
    );
  }
```
---
## Unsubscribe
user.component.ts
```javascript
import { Subscription } from 'rxjs/Subscription';

paramsSubscription: Subscription;

this.paramsSubscription =this.route.params.subscribe(
      (params: Params) => {
        this.user.id = params['id'];
        this.user.name = params['name'];
      }
    );

ngOnDestroy() {
    this.paramsSubscription.unsubscribe();
}
```
---
## Query params and fragment

1.
servers.component.html
```html
<a 
    [routerLink]="['/servers', 5, 'edit']"
    [queryParams]="{allowEdit: '1'}"
    fragment="loading"
    class="list-group-item"
    *ngFor="let server of servers">
    {{ server.name }}
</a>
```

2.
home.component.ts
```javascript
onLoadServer(id: number) {
    this.router.navigate(['/servers', 1, 'edit'], {queryParams: {allowEdit: 1}, fragment: 'loading'});
  }
```
---
## Retrieving query params and fragment

edit-server.component.ts
```javascript
import { ActivatedRoute } from '@angular/router';

constructor(private serversService: ServersService,
              private route: ActivatedRoute) { }

ngOnInit() {
    console.log(this.route.snapshot.queryParams);
    console.log(this.route.snapshot.fragment);
    this.server = this.serversService.getServer(1);
    this.serverName = this.server.name;
    this.serverStatus = this.server.status;
  }
```

```javascript
this.route.queryParams.subscribe();
this.route.fragment.subscribe();
```

```html
<a 
        [routerLink]="['/users', user.id, user.name]"
        href="#" 
        class="list-group-item"
        *ngFor="let user of users">
        {{ user.name }}
      </a>
```
---
## 19 Redirecting and wildcard routes

```
ng g c page-not-found
```
app.module.ts
```javascript
const appRoutes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'users', component: UsersComponent, children: [
    { path: ':id/:name', component: UserComponent }
  ] },
  { path: 'servers', component: ServersComponent, children: [
    { path: ':id', component: ServerComponent },
    { path: ':id/edit', component: EditServerComponent }
  ] },
  { path: 'not-found', component: PageNotFoundComponent},
  { path: '**', redirectTo: '/not-found'}
]
```
---
## Move appRoute to seperate file
app-routing.module.ts
```javascript
import { Routes, RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';

import { HomeComponent } from './home/home.component';
import { UsersComponent } from './users/users.component';
import { UserComponent } from './users/user/user.component';
import { ServersComponent } from './servers/servers.component';
import { ServerComponent } from './servers/server/server.component';
import { EditServerComponent } from './servers/edit-server/edit-server.component';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';

const appRoutes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'users', component: UsersComponent, children: [
    { path: ':id/:name', component: UserComponent }
  ] },
  { path: 'servers', component: ServersComponent, children: [
    { path: ':id', component: ServerComponent },
    { path: ':id/edit', component: EditServerComponent }
  ] },
  { path: 'not-found', component: PageNotFoundComponent},
  { path: '**', redirectTo: '/not-found'}
]

@NgModule({
    imports: [ RouterModule.forRoot(appRoutes) ],
    exports: [ RouterModule ]
})
export class AppRoutingModule {
}
```
app.module.ts
```javascript
import { AppRoutingModule } from './app-routing.module';

imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    AppRoutingModule
  ],
```
---
## canactivated guard

auth-guard.service.ts
```javascript
import { 
    CanActivate, 
    ActivatedRouteSnapshot,
    RouterStateSnapshot,
    Router
} from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { Injectable } from '@angular/core';
import { AuthService } from './auth.service';

@Injectable()
export class AuthGuard implements CanActivate {

    constructor(private authService: AuthService, private router: Router){ };

    canActivate(route: ActivatedRouteSnapshot,
                state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
                    return this.authService.isAuthenticated()
                        .then(
                            (authenticated: boolean) => {
                                if (authenticated) {
                                    return true;
                                } else {
                                    this.router.navigate(['/']);
                                }
                            }
                        );
                }
    canActivateChild(route: ActivatedRouteSnapshot,
                state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
                    return this.canActivate(route, state);
                }
}
```
auth.service.ts
```javascript
export class AuthService {
    loggedIn = false;

    isAuthenticated() {
        const promise = new Promise(
            (resolve, reject) => {
                setTimeout( () => {
                    resolve(this.loggedIn)
                }, 800);
            }
        );
        return promise;
    }

    login() {
        this.loggedIn = true;
    }

    logout() {
        this.loggedIn = false;
    }
}
```
app-routing.module.ts
```javascript
{ path: 'servers', canActivate: [AuthGuard], component: ServersComponent, children: [
    { path: ':id', component: ServerComponent },
    { path: ':id/edit', component: EditServerComponent }
  ] },

{ path: 'servers', canActivateChild: [AuthGuard], component: ServersComponent, children: [
    { path: ':id', component: ServerComponent },
    { path: ':id/edit', component: EditServerComponent }
  ] },
```
app.module.ts
```javascript
providers: [ServersService, AuthService, AuthGuard],
```