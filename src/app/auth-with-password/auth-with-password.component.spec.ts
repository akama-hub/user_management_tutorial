import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AuthWithPasswordComponent } from './auth-with-password.component';

describe('AuthWithPasswordComponent', () => {
  let component: AuthWithPasswordComponent;
  let fixture: ComponentFixture<AuthWithPasswordComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AuthWithPasswordComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AuthWithPasswordComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
