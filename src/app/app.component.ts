import { Component, OnInit } from '@angular/core'
import { SupabaseService } from './services/supabase.service'
import { AccountComponent } from './account/account.component'
import { AuthComponent } from './auth/auth.component'
import { SharedModule } from './shared/shared.module' 
import { SignUpComponent } from './sign-up/sign-up.component'
import { AuthWithPasswordComponent } from './auth-with-password/auth-with-password.component'
import { HeaderComponent } from './header/header.component'

@Component({
  standalone: true,
  selector: 'app-root',
  templateUrl: './app.component.html',
  // template: '<router-outlet></router-outlet>',
  styleUrls: ['./app.component.css'],
  imports: [
    AccountComponent,
    AuthComponent,
    SharedModule,
    SignUpComponent,
    AuthWithPasswordComponent,
    HeaderComponent
  ]
})

export class AppComponent implements OnInit {
  title = 'user_management_tutorial'

  session = this.supabase.session

  public eventData: String = "1";
  private blurFlag: HTMLElement | null | undefined;

  constructor(private readonly supabase: SupabaseService) {}

  ngOnInit() {
    this.supabase.authChanges((_, session) => (this.session = session))
  }

  ngAfterViewChecked() {
    this.blurFlag = document.getElementById("main");
  }

  onReceiveEventFromChild(eventData: String) {
    this.eventData = eventData;
    if(this.blurFlag){
      console.log(eventData);
      if ( eventData == "-1") {
        this.blurFlag.classList.add('blur');
      }
      else {
        this.blurFlag.classList.remove('blur');
      }
    }
  }
}
