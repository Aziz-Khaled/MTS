import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { loadStripe, Stripe, StripeElements } from '@stripe/stripe-js';
import { NavbarComponent } from '../../../components/navbar/navbar.component';
import { FooterComponent } from '../../../components/footer/footer.component';
import { PaymentService } from '../../../Services/payment.service';
import { ReservationService, Reservation } from '../../../Services/reservation.service';
import { VehicleService, Vehicle } from '../../../Services/vehicle.service';

// Replace with your real Stripe test publishable key (pk_test_...) from your dashboard.
const STRIPE_PUBLISHABLE_KEY = 'pk_test_51UABu1L6PWQBjEQyf8isi7i9TEbPteY6dW6665iQ1sEvxUCxhsA6vA20iaVprZSVurxOTzbkLiTu0wHPHGTrPg9s00TIEyoURM';

@Component({
  selector: 'mts-payment',
  standalone: true,
  imports: [RouterLink, NavbarComponent, FooterComponent],
  template: `
    <mts-navbar [alwaysSolid]="true" [showBookButton]="false"></mts-navbar>

    <main class="bg-mts-surface min-h-screen pt-32 pb-20">
      <div class="max-w-2xl mx-auto px-6 lg:px-10">

        @if (loading) {
          <p class="text-center text-mts-steel py-20">Preparing your payment...</p>
        } @else if (error) {
          <div class="card-surface border border-mts-surface p-10 text-center">
            <p class="text-red-600 mb-4">{{ error }}</p>
            <a routerLink="/vehicles" class="text-mts-blue font-accent font-semibold hover:underline">Browse vehicles</a>
          </div>
        } @else if (reservation && vehicle) {
          <p class="section-eyebrow mb-3">Secure Your Booking</p>
          <h1 class="font-display font-bold text-3xl text-mts-black mb-8">Pay Your Deposit</h1>

          <div class="card-surface border border-mts-surface shadow-soft p-8 mb-6">
            <div class="flex items-center justify-between mb-5 pb-5 border-b border-mts-surface">
              <div>
                <p class="font-display font-semibold text-mts-black">{{ vehicle.brand }} {{ vehicle.model }}</p>
                <p class="text-sm text-mts-steel">{{ reservation.pickupDate }} &rarr; {{ reservation.returnDate }}</p>
              </div>
              <p class="font-display font-bold text-lg text-mts-black">{{ reservation.totalPrice }}&euro;</p>
            </div>

            <div class="flex items-center justify-between mb-2">
              <span class="text-sm text-mts-steel">Deposit due now (30%)</span>
              <span class="font-display font-bold text-2xl text-mts-navy">{{ reservation.depositAmount }}&euro;</span>
            </div>
            <p class="text-xs text-mts-steel">The remaining {{ remainingBalance() }}&euro; is paid at pickup.</p>

            @if (timeRemaining) {
              <div class="mt-5 pt-5 border-t border-mts-surface flex items-center gap-2 text-sm">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#0F2747" stroke-width="2"><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/></svg>
                <span class="text-mts-black">Complete payment within</span>
                <span class="font-accent font-bold text-mts-navy">{{ timeRemaining }}</span>
                <span class="text-mts-steel">or this reservation will be released.</span>
              </div>
            }
          </div>

          <div class="card-surface border border-mts-surface shadow-soft p-8">
            <div id="payment-element" class="mb-6"></div>

            @if (paymentError) {
              <p class="text-sm text-red-600 mb-4">{{ paymentError }}</p>
            }

            <button
              type="button"
              (click)="pay()"
              [disabled]="paying || !elementsReady"
              class="btn-primary w-full disabled:opacity-50"
            >
              {{ paying ? 'Processing...' : 'Pay ' + reservation.depositAmount + '\u20ac Deposit' }}
            </button>

            <p class="text-xs text-mts-steel text-center mt-4">
              Payments are securely processed by Stripe. MTS never stores your card details.
            </p>
          </div>
        }
      </div>
    </main>

    <mts-footer></mts-footer>
  `,
})
export class PaymentComponent implements OnInit, OnDestroy {
  reservation: Reservation | null = null;
  vehicle: Vehicle | null = null;
  loading = true;
  error = '';
  paymentError = '';
  paying = false;
  elementsReady = false;

  timeRemaining = '';
  private countdownInterval: ReturnType<typeof setInterval> | null = null;

  private stripe: Stripe | null = null;
  private elements: StripeElements | null = null;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private paymentService: PaymentService,
    private reservationService: ReservationService,
    private vehicleService: VehicleService
  ) {}

  async ngOnInit(): Promise<void> {
    const reservationId = this.route.snapshot.paramMap.get('id');
    if (!reservationId) {
      this.error = 'Missing reservation reference.';
      this.loading = false;
      return;
    }

    this.reservationService.getById(reservationId).subscribe({
      next: (reservation) => {
        this.reservation = reservation;

        if (reservation.status !== 'PENDING') {
          this.error = 'This reservation is no longer awaiting payment.';
          this.loading = false;
          return;
        }

        this.startCountdown();

        this.vehicleService.getById(reservation.vehicleId).subscribe({
          next: (vehicle) => {
            this.vehicle = vehicle;
            this.initStripe(reservationId);
          },
          error: () => {
            this.error = 'Could not load vehicle details.';
            this.loading = false;
          },
        });
      },
      error: () => {
        this.error = 'Could not load this reservation.';
        this.loading = false;
      },
    });
  }

  ngOnDestroy(): void {
    if (this.countdownInterval) clearInterval(this.countdownInterval);
  }

  remainingBalance(): number {
    if (!this.reservation) return 0;
    return Math.round((this.reservation.totalPrice - this.reservation.depositAmount) * 100) / 100;
  }

  private async initStripe(reservationId: string): Promise<void> {
    this.paymentService.createIntent(reservationId).subscribe({
      next: async (res) => {
        this.stripe = await loadStripe(STRIPE_PUBLISHABLE_KEY);
        if (!this.stripe) {
          this.error = 'Could not initialize the payment provider.';
          this.loading = false;
          return;
        }

        this.elements = this.stripe.elements({ clientSecret: res.clientSecret });
        const paymentElement = this.elements.create('payment');
        paymentElement.mount('#payment-element');

        this.elementsReady = true;
        this.loading = false;
      },
      error: (err) => {
        this.error = err?.error?.message || 'Could not start the payment process.';
        this.loading = false;
      },
    });
  }

  async pay(): Promise<void> {
    if (!this.stripe || !this.elements) return;

    this.paying = true;
    this.paymentError = '';

    const { error } = await this.stripe.confirmPayment({
      elements: this.elements,
      confirmParams: {
        return_url: `${window.location.origin}/payment/success`,
      },
    });

    // If we reach this line, the payment did not require a redirect and failed immediately
    // (successful non-redirect payments navigate away via return_url automatically... actually
    // Stripe only redirects for methods that require it; for cards it resolves here on success too,
    // so we check the error explicitly rather than assuming failure).
    if (error) {
      this.paymentError = error.message || 'Payment failed. Please check your details and try again.';
      this.paying = false;
    }
  }

  private startCountdown(): void {
    if (!this.reservation?.paymentDeadline) return;
    const deadline = new Date(this.reservation.paymentDeadline);

    const update = () => {
      const diff = deadline.getTime() - Date.now();
      if (diff <= 0) {
        this.timeRemaining = 'Expired';
        if (this.countdownInterval) clearInterval(this.countdownInterval);
        return;
      }
      const hours = Math.floor(diff / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      this.timeRemaining = `${hours}h ${minutes}m`;
    };

    update();
    this.countdownInterval = setInterval(update, 60 * 1000);
  }
}