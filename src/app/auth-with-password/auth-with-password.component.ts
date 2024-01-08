import { Component } from '@angular/core';
import { SupabaseService } from '../services/supabase.service'
import { FormBuilder } from '@angular/forms'
import { SharedModule } from '../shared/shared.module'
import { Router } from '@angular/router';

@Component({
  selector: 'app-auth-with-password',
  standalone: true,
  imports: [SharedModule,],
  templateUrl: './auth-with-password.component.html',
  styleUrl: './auth-with-password.component.css'
})
export class AuthWithPasswordComponent {
  loading = false

  signInForm = this.formBuilder.group({
    email: '', password: ''
  })

  constructor(
    private router: Router,
    private readonly supabase: SupabaseService,
    private readonly formBuilder: FormBuilder
  ) {}

  async onSubmit(): Promise<void> {
    try {
      this.loading = true
      const email = this.signInForm.value.email as string
      // const { error } = await this.supabase.signIn(email)

      const password = this.signInForm.value.password as string
      const { error } = await this.supabase.signInWithPassword(email, password)
      
      console.log(email, password)

      if (error) throw error
    } catch (error) {
      if (error instanceof Error) {
        alert(error.message);
        console.log("error")
      }
    } finally {
      this.signInForm.reset()
      this.router.navigate(['/']);
      this.loading = false
    }
  }
}
