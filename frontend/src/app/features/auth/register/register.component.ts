import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  template: `
    <div class="container">
      <div class="row justify-content-center">
        <div class="col-md-6 col-lg-4">
          <div class="card card-glass mt-5">
            <div class="card-body p-5">
              <div class="text-center mb-4">
                <div class="display-4 mb-3">🚀</div>
                <h2 class="fw-bold text-primary">Start Your Journey</h2>
                <p class="text-muted">Create an account to begin tracking your habits</p>
              </div>

              <form [formGroup]="registerForm" (ngSubmit)="onSubmit()">
                <div class="mb-3">
                  <label for="username" class="form-label">Username</label>
                  <div class="input-group">
                    <span class="input-group-text">
                      <i class="bi bi-person"></i>
                    </span>
                    <input
                      type="text"
                      class="form-control"
                      id="username"
                      formControlName="username"
                      placeholder="Choose a username"
                      [class.is-invalid]="isFieldInvalid('username')"
                    >
                  </div>
                  <div class="invalid-feedback" *ngIf="isFieldInvalid('username')">
                    Username must be at least 3 characters long.
                  </div>
                </div>

                <div class="mb-3">
                  <label for="email" class="form-label">Email</label>
                  <div class="input-group">
                    <span class="input-group-text">
                      <i class="bi bi-envelope"></i>
                    </span>
                    <input
                      type="email"
                      class="form-control"
                      id="email"
                      formControlName="email"
                      placeholder="Enter your email"
                      [class.is-invalid]="isFieldInvalid('email')"
                    >
                  </div>
                  <div class="invalid-feedback" *ngIf="isFieldInvalid('email')">
                    Please enter a valid email address.
                  </div>
                </div>

                <div class="mb-3">
                  <label for="password" class="form-label">Password</label>
                  <div class="input-group">
                    <span class="input-group-text">
                      <i class="bi bi-lock"></i>
                    </span>
                    <input
                      type="password"
                      class="form-control"
                      id="password"
                      formControlName="password"
                      placeholder="Create a password"
                      [class.is-invalid]="isFieldInvalid('password')"
                    >
                  </div>
                  <div class="invalid-feedback" *ngIf="isFieldInvalid('password')">
                    Password must be at least 6 characters long.
                  </div>
                </div>

                <div class="mb-3">
                  <label for="confirmPassword" class="form-label">Confirm Password</label>
                  <div class="input-group">
                    <span class="input-group-text">
                      <i class="bi bi-lock-fill"></i>
                    </span>
                    <input
                      type="password"
                      class="form-control"
                      id="confirmPassword"
                      formControlName="confirmPassword"
                      placeholder="Confirm your password"
                      [class.is-invalid]="isFieldInvalid('confirmPassword')"
                    >
                  </div>
                  <div class="invalid-feedback" *ngIf="isFieldInvalid('confirmPassword')">
                    Passwords do not match.
                  </div>
                </div>

                <div class="d-grid mb-3">
                  <button
                    type="submit"
                    class="btn btn-primary btn-lg"
                    [disabled]="registerForm.invalid || isLoading"
                  >
                    <span class="spinner-border spinner-border-sm me-2" *ngIf="isLoading"></span>
                    {{ isLoading ? 'Creating Account...' : 'Create Account' }}
                  </button>
                </div>

                <div class="text-center">
                  <p class="mb-0">
                    Already have an account?
                    <a routerLink="/auth/login" class="text-primary text-decoration-none fw-semibold">
                      Sign in here
                    </a>
                  </p>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .card {
      border: none;
      box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
    }
    
    .form-control:focus {
      border-color: var(--primary-color);
      box-shadow: 0 0 0 0.2rem rgba(59, 130, 246, 0.25);
    }
    
    .input-group-text {
      background-color: #f8f9fa;
      border-color: #dee2e6;
    }
  `]
})
export class RegisterComponent {
  registerForm: FormGroup;
  isLoading = false;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.registerForm = this.fb.group({
      username: ['', [Validators.required, Validators.minLength(3)]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', [Validators.required]]
    }, { validators: this.passwordMatchValidator });
  }

  passwordMatchValidator(form: FormGroup) {
    const password = form.get('password');
    const confirmPassword = form.get('confirmPassword');
    
    if (password && confirmPassword && password.value !== confirmPassword.value) {
      confirmPassword.setErrors({ passwordMismatch: true });
      return { passwordMismatch: true };
    }
    
    return null;
  }

  isFieldInvalid(fieldName: string): boolean {
    const field = this.registerForm.get(fieldName);
    return !!(field && field.invalid && (field.dirty || field.touched));
  }

  onSubmit(): void {
    if (this.registerForm.valid) {
      this.isLoading = true;
      const { username, email, password } = this.registerForm.value;

      this.authService.register({ username, email, password }).subscribe({
        next: () => {
          this.router.navigate(['/dashboard']);
        },
        error: (error) => {
          console.error('Registration error:', error);
          this.isLoading = false;
          // You could add toast notification here
        }
      });
    }
  }
}
