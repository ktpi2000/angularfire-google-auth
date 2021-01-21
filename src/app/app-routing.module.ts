import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { SecretComponent } from './secret/secret.component';
import { AuthGuard } from './services/auth.guard';

const routes: Routes = [
  { path: 'secret', component: SecretComponent, canActivate: [AuthGuard] }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
