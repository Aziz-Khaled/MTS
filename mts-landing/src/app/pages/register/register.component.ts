import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { NavbarComponent } from '../../components/navbar/navbar.component';
import { FooterComponent } from '../../components/footer/footer.component';
import { AuthService } from '../../Services/auth.service';

@Component({
  selector: 'mts-register',
  standalone: true,
  imports: [FormsModule, RouterLink, NavbarComponent, FooterComponent],
  template: `
    <mts-navbar [alwaysSolid]="true" [showBookButton]="false"></mts-navbar>

    <main class="bg-mts-surface min-h-screen pt-32 pb-20 flex items-center justify-center px-6">
      <div class="card-surface border border-mts-surface shadow-soft w-full max-w-lg p-8 lg:p-10">
        <p class="section-eyebrow mb-3">Join MTS</p>
        <h1 class="font-display font-bold text-2xl text-mts-black mb-8">Create your account</h1>

        <form (submit)="submit($event)" class="flex flex-col gap-5">
          <div class="grid grid-cols-2 gap-4">
            <label class="flex flex-col gap-2">
              <span class="text-xs font-accent font-semibold text-mts-steel uppercase tracking-wide">First Name</span>
              <input type="text" required [(ngModel)]="firstName" name="firstName" class="border border-mts-surface bg-mts-surface rounded-xl px-4 py-3 text-sm outline-none focus:border-mts-blue transition-colors" />
            </label>
            <label class="flex flex-col gap-2">
              <span class="text-xs font-accent font-semibold text-mts-steel uppercase tracking-wide">Last Name</span>
              <input type="text" required [(ngModel)]="lastName" name="lastName" class="border border-mts-surface bg-mts-surface rounded-xl px-4 py-3 text-sm outline-none focus:border-mts-blue transition-colors" />
            </label>
          </div>

          <label class="flex flex-col gap-2">
            <span class="text-xs font-accent font-semibold text-mts-steel uppercase tracking-wide">Email</span>
            <input type="email" required [(ngModel)]="email" name="email" class="border border-mts-surface bg-mts-surface rounded-xl px-4 py-3 text-sm outline-none focus:border-mts-blue transition-colors" />
          </label>

          <div class="grid grid-cols-2 gap-4">
            <label class="flex flex-col gap-2">
              <span class="text-xs font-accent font-semibold text-mts-steel uppercase tracking-wide">Phone</span>
              <input type="tel" required [(ngModel)]="phone" name="phone" class="border border-mts-surface bg-mts-surface rounded-xl px-4 py-3 text-sm outline-none focus:border-mts-blue transition-colors" />
            </label>
            <label class="flex flex-col gap-2">
              <span class="text-xs font-accent font-semibold text-mts-steel uppercase tracking-wide">Date of Birth</span>
              <input type="date" required [(ngModel)]="dateOfBirth" name="dateOfBirth" class="border border-mts-surface bg-mts-surface rounded-xl px-4 py-3 text-sm outline-none focus:border-mts-blue transition-colors" />
            </label>
          </div>

          <label class="flex flex-col gap-2">
            <span class="text-xs font-accent font-semibold text-mts-steel uppercase tracking-wide">Driving License Number</span>
            <input type="text" required [(ngModel)]="drivingLicenseNumber" name="drivingLicenseNumber" class="border border-mts-surface bg-mts-surface rounded-xl px-4 py-3 text-sm outline-none focus:border-mts-blue transition-colors" />
          </label>

          <label class="flex flex-col gap-2">
            <span class="text-xs font-accent font-semibold text-mts-steel uppercase tracking-wide">Password</span>
            <input type="password" required minlength="8" [(ngModel)]="password" name="password" class="border border-mts-surface bg-mts-surface rounded-xl px-4 py-3 text-sm outline-none focus:border-mts-blue transition-colors" />
          </label>

          @if (errorMessage) {
            <p class="text-sm text-red-600">{{ errorMessage }}</p>
          }

          <button type="submit" [disabled]="loading" class="btn-primary w-full mt-2 disabled:opacity-60">
            {{ loading ? 'Creating account...' : 'Create Account' }}
          </button>
        </form>

        <p class="text-sm text-mts-steel text-center mt-6">
          Already have an account?
          <a routerLink="/login" [queryParams]="returnUrl ? { returnUrl } : {}" class="text-mts-blue font-semibold hover:underline">Log in</a>
        </p>
      </div>
    </main>

    <mts-footer></mts-footer>
  `,
})
export class RegisterComponent {
  firstName = '';
  lastName = '';
  email = '';
  phone = '';
  dateOfBirth = '';
  drivingLicenseNumber = '';
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

    this.authService
      .register({
        firstName: this.firstName,
        lastName: this.lastName,
        email: this.email,
        phone: this.phone,
        dateOfBirth: this.dateOfBirth,
        drivingLicenseNumber: this.drivingLicenseNumber,
        password: this.password,
      })
      .subscribe({
        next: () => {
          this.loading = false;
          this.router.navigateByUrl(this.returnUrl || '/');
        },
        error: (err) => {
          this.loading = false;
          this.errorMessage =
            err?.error?.message || 'Could not create account. Please check your details.';
        },
      });
  }
}