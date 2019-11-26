import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { OrderComponent } from './order/order.component';
const routes: Routes = [
  {
      path: '',
      redirectTo: '/order',
      pathMatch: 'full',
  },
  { path: 'order', component: OrderComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes,{ useHash: true })],
  exports: [RouterModule]
})

export class AppRoutingModule {}
