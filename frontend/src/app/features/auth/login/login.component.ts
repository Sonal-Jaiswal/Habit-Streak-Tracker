import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  template: `
    <div class="container">
      <div class="row justify-content-center">
        <div class="col-md-6 col-lg-4">
          <div class="card card-glass mt-5">
            <div class="card-body p-5">
              <div class="text-center mb-4">
                <div class="display-4 mb-3">🔥</div>
                <h2 class="fw-bold text-primary">Welcome Back!</h2>
                <p class="text-muted">Sign in to continue your habit journey</p>
              </div>

              <form [formGroup]="loginForm" (ngSubmit)="onSubmit()">
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
                      placeholder="Enter your password"
                      [class.is-invalid]="isFieldInvalid('password')"
                    >
                  </div>
                  <div class="invalid-feedback" *ngIf="isFieldInvalid('password')">
                    Password is required.
                  </div>
                </div>

                <div class="d-grid mb-3">
                  <button
                    type="submit"
                    class="btn btn-primary btn-lg"
                    [disabled]="loginForm.invalid || isLoading"
                  >
                    <span class="spinner-border spinner-border-sm me-2" *ngIf="isLoading"></span>
                    {{ isLoading ? 'Signing In...' : 'Sign In' }}
                  </button>
                </div>

                <div class="text-center">
                  <p class="mb-0">
                    Don't have an account?
                    <a routerLink="/auth/register" class="text-primary text-decoration-none fw-semibold">
                      Sign up here
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
export class LoginComponent {
  loginForm: FormGroup;
  isLoading = false;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  isFieldInvalid(fieldName: string): boolean {
    const field = this.loginForm.get(fieldName);
    return !!(field && field.invalid && (field.dirty || field.touched));
  }

  onSubmit(): void {
    if (this.loginForm.valid) {
      this.isLoading = true;
      const { email, password } = this.loginForm.value;

      this.authService.login({ email, password }).subscribe({
        next: () => {
          this.router.navigate(['/dashboard']);
        },
        error: (error) => {
          console.error('Login error:', error);
          this.isLoading = false;
          // You could add toast notification here
        }
      });
    }
  }
}
