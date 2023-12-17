import { Component } from '@angular/core';
import { SupabaseService } from '../services/supabase.service'
import { FormBuilder } from '@angular/forms'
import { SharedModule } from '../shared/shared.module'

@Component({
  selector: 'app-sign-up',
  standalone: true,
  imports: [SharedModule,],
  templateUrl: './sign-up.component.html',
  styleUrl: './sign-up.component.css'
})
export class SignUpComponent {
  loading = false

  signInForm = this.formBuilder.group({
    email: '', password: ''
  })

  constructor(
    private readonly supabase: SupabaseService,
    private readonly formBuilder: FormBuilder
  ) {}

  async onSubmit(): Promise<void> {
    try {
      this.loading = true
      const email = this.signInForm.value.email as string
      const password = this.signInForm.value.password as string
      const { error } = await this.supabase.signUpNewUser(email, password)

      if (error) throw error
      alert('Check your email for the login link!')
    } catch (error) {
      if (error instanceof Error) {
        alert(error.message)
      }
    } finally {
      this.signInForm.reset()
      this.loading = false
    }
  }
}
