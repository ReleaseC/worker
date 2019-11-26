import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { MenuComponent } from './modules/menu/menu.component';
import { ProfitComponent } from './modules/menu/profit/profit.component';
const routes: Routes = [
    {
        path: '',
        redirectTo: '/login',
        pathMatch: 'full',
    },
    { path: 'login', component: LoginComponent },
    {
        path: 'menu',
        component: MenuComponent,
        children: [
            {
                path: 'profit',
                component: ProfitComponent
            }
        ]
    }
];

@NgModule({
    imports: [RouterModule.forRoot(routes, { useHash: true })],
    exports: [RouterModule]
})

export class AppRoutingModule { }
