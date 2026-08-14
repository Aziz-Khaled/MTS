import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { NavbarComponent } from '../../components/navbar/navbar.component';
import { FooterComponent } from '../../components/footer/footer.component';
import { AuthService } from '../../Services/auth.service';

@Component({
  selector: 'mts-login',
  standalone: true,
  imports: [FormsModule, RouterLink, NavbarComponent, FooterComponent],
  template: `
    <mts-navbar [alwaysSolid]="true" [showBookButton]="false"></mts-navbar>

    <main class="bg-mts-surface min-h-screen pt-32 pb-20 flex items-center justify-center px-6">
      <div class="card-surface border border-mts-surface shadow-soft w-full max-w-md p-8 lg:p-10">
        <p class="section-eyebrow mb-3">Welcome Back</p>
        <h1 class="font-display font-bold text-2xl text-mts-black mb-8">Log in to MTS</h1>

        <form (submit)="submit($event)" class="flex flex-col gap-5">
          <label class="flex flex-col gap-2">
            <span class="text-xs font-accent font-semibold text-mts-steel uppercase tracking-wide">Email</span>
            <input
              type="email"
              required
              [(ngModel)]="email"
              name="email"
              class="border border-mts-surface bg-mts-surface rounded-xl px-4 py-3 text-sm outline-none focus:border-mts-blue transition-colors"
            />
          </label>

          <label class="flex flex-col gap-2">
            <span class="text-xs font-accent font-semibold text-mts-steel uppercase tracking-wide">Password</span>
            <input
              type="password"
              required
              [(ngModel)]="password"
              name="password"
              class="border border-mts-surface bg-mts-surface rounded-xl px-4 py-3 text-sm outline-none focus:border-mts-blue transition-colors"
            />
          </label>

          @if (errorMessage) {
            <p class="text-sm text-red-600">{{ errorMessage }}</p>
          }

          <button type="submit" [disabled]="loading" class="btn-primary w-full mt-2 disabled:opacity-60">
            {{ loading ? 'Logging in...' : 'Log In' }}
          </button>
        </form>

        <p class="text-sm text-mts-steel text-center mt-6">
          Don't have an account?
          <a routerLink="/register" [queryParams]="returnUrl ? { returnUrl } : {}" class="text-mts-blue font-semibold hover:underline">Register</a>
        </p>
      </div>
    </main>

    <mts-footer></mts-footer>
  `,
})
export class LoginComponent {
  email = '';
  password = '';
  loading = false;
  errorMessage = '';
  returnUrl: string | null = null;

  constructor(
    private authService: AuthService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.returnUrl = this.route.snapshot.queryParamMap.get('returnUrl');
  }

  submit(event: Event): void {
    event.preventDefault();
    this.loading = true;
    this.errorMessage = '';

    this.authService.login({ email: this.email, password: this.password }).subscribe({
      next: (res) => {
        this.loading = false;
        if (res.role === 'ADMIN') {
          this.router.navigateByUrl('/admin');
        } else {
          this.router.navigateByUrl(this.returnUrl || '/');
        }
      },
      error: () => {
        this.loading = false;
        this.errorMessage = 'Invalid email or password.';
      },
    });
  }
}