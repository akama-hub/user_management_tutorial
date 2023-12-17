import { Component, OnInit } from '@angular/core'
import { SupabaseService } from './services/supabase.service'
import { AccountComponent } from './account/account.component'
import { AuthComponent } from './auth/auth.component'
import { SharedModule } from './shared/shared.module' 

@Component({
  standalone: true,
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  imports: [
    AccountComponent,
    AuthComponent,
    SharedModule
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
