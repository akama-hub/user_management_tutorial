import { Injectable } from '@angular/core';
import { SupabaseService } from './supabase.service';
import { SupabaseClient, User, createClient } from '@supabase/supabase-js';
import { environment } from '../../environments/environment';
import { Observable, Subject } from 'rxjs';

export interface Income {
  id?: string
  income?: number | null
  subIncome?: number | null
  expenses?: number | null
  deduction?: number | null
}

@Injectable({
  providedIn: 'root'
})
export class IncomeService {
  private subject$ = new Subject<Income[]> ();
  private supabase: SupabaseClient;

  constructor(supabaseService: SupabaseService) {
    this.supabase = supabaseService.supabase;
  }

  getIncome(user: User): Observable<Income[]> {
    this.supabase
      .from('income')
      .select('income, subIncome, expenses, deduction')
      .eq('id', user.id)
      .then( res => {
        console.log(res);
        this.subject$.next(res.data as Income[]);
      })
    return this.subject$.asObservable();
  }

  addIncome(income: Income | undefined | null): void {
    if(income){
      this.supabase
        .from('income')
        .insert(income)
    }
  }
}
