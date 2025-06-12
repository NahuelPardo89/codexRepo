import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SendnewletterComponent } from './components/sendnewletter/sendnewletter.component';

const routes: Routes = [
  { path: 'send', component: SendnewletterComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class NewsletterRoutingModule { }
