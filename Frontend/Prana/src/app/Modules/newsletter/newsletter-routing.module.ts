import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SendNewsletterComponent } from './components/send-newsletter/send-newsletter.component';

const routes: Routes = [
  { path: 'send', component: SendNewsletterComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class NewsletterRoutingModule { }
