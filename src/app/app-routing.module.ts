import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AddDishComponent } from './add-dish/add-dish.component';
import { AddProductComponent } from './add-product/add-product.component';
import { MainContainerComponent } from './main-container/main-container.component';

const routes: Routes = [
  {path:'produkty', component: AddProductComponent},
  {path:'dania', component: AddDishComponent},
  {path:'', component: MainContainerComponent},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
