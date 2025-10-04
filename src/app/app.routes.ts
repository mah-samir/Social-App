import { Routes } from '@angular/router';
import { MainLayoutComponent } from './core/layouts/main-layout/main-layout.component';
import { TimeLineComponent } from './features/time-line/time-line.component';
import { ProfileComponent } from './features/profile/profile.component';
import { DatailsPostComponent } from './features/datails-post/datails-post.component';
import { AuthLayoutComponent } from './core/layouts/auth-layout/auth-layout.component';
import { LoginComponent } from './features/auth/login/login.component';
import { RegisterComponent } from './features/auth/register/register.component';
import { NotFoundComponent } from './features/not-found/not-found.component';
import { authGuard } from './features/auth/auth-guard';
import { isLoggedGuard } from './features/auth/is-logged-guard';

export const routes: Routes = [{ path: '', redirectTo: 'timeline', pathMatch: 'full' }, {
    path: '', canActivate: [authGuard], component: MainLayoutComponent, children: [
        { path: 'timeline', component: TimeLineComponent, title: 'TimeLine' },
        { path: 'profile', component: ProfileComponent, title: 'profile' },
        { path: 'details', component: DatailsPostComponent, title: 'Details' },
        { path: 'forget', component: TimeLineComponent, title: 'Forget Password' },
    ]
}, {
    path: '', component: AuthLayoutComponent, canActivate: [isLoggedGuard], children: [
        { path: 'login', component: LoginComponent, title: 'Login Page' },
        { path: 'register', component: RegisterComponent, title: 'Register Page' }
    ]
}, { path: '**', component: NotFoundComponent, title: 'Not Found' }

];
