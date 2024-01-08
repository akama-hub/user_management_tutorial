import { Component } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { Income, IncomeService } from '../services/income.service';
import { Observable } from 'rxjs';
import { Input } from '@angular/core';
import { Session, User } from '@supabase/supabase-js';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    ReactiveFormsModule,
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {
  incomeForm = new FormGroup( {
    income: new FormControl(0),
    subIncome: new FormControl(0),
    expenses: new FormControl(0),
    deduction: new FormControl(0),
  })

  private income: Observable<Income[]> | undefined;
  private user!: User;

  constructor( public incomeService: IncomeService ) {
    
  }

  onSubmit() {
    // TODO: Use EventEmitter with form value
    console.warn(this.incomeForm.value);
  }

  updateIncome() {
    this.incomeForm.patchValue({

    });
    console.log(this.incomeForm)
  }

  // updateIncome: void () {
  //   this.income.setValue();
  // }
}
