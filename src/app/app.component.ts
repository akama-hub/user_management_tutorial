import { Component, OnInit } from '@angular/core'
import { SupabaseService } from './services/supabase.service'
import { AccountComponent } from './account/account.component'
import { AuthComponent } from './auth/auth.component'
import { SharedModule } from './shared/shared.module' 
import { SignUpComponent } from './sign-up/sign-up.component'
import { AuthWithPasswordComponent } from './auth-with-password/auth-with-password.component'

@Component({
  standalone: true,
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  imports: [
    AccountComponent,
    AuthComponent,
    SharedModule,
    SignUpComponent,
    AuthWithPasswordComponent
  ]
})

export class AppComponent implements OnInit {
  title = 'user_management_tutorial'

  session = this.supabase.session

  constructor(private readonly supabase: SupabaseService) {}

  ngOnInit() {
    this.supabase.authChanges((_, session) => (this.session = session))
  }
}
