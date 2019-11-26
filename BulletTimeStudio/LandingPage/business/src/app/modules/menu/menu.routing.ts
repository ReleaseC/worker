import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { MenuComponent } from './menu.component';
import{ProfitComponent} from './profit/profit.component';
import{ProfitVideoComponent} from './profitvideo/profitvideo.component';
const routes: Routes = [
    {
        path: 'menu',
        component: MenuComponent,
        children: [
            {
                path: 'profit',
                component: ProfitComponent,
            },
            {
                path: 'profitvideo',
                component: ProfitVideoComponent,
            },
        ]
    }
];
@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class MenuRoutingModule {}
