import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { loadStripe } from '@stripe/stripe-js';
import { NavbarComponent } from '../../../components/navbar/navbar.component';
import { FooterComponent } from '../../../components/footer/footer.component';

const STRIPE_PUBLISHABLE_KEY = 'pk_test_51UABu1L6PWQBjEQyf8isi7i9TEbPteY6dW6665iQ1sEvxUCxhsA6vA20iaVprZSVurxOTzbkLiTu0wHPHGTrPg9s00TIEyoURM';

@Component({
  selector: 'mts-payment-success',
  standalone: true,
  imports: [RouterLink, NavbarComponent, FooterComponent],
  template: `
    <mts-navbar [alwaysSolid]="true" [showBookButton]="false"></mts-navbar>

    <main class="bg-mts-surface min-h-screen pt-32 pb-20 flex items-center justify-center px-6">
      <div class="card-surface border border-mts-surface shadow-soft p-10 text-center max-w-lg">
        @if (checking) {
          <p class="text-mts-steel">Confirming your payment...</p>
        } @else if (status === 'succeeded') {
          <div class="w-16 h-16 mx-auto rounded-full bg-green-50 flex items-center justify-center mb-6">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#16a34a" stroke-width="2"><path d="M20 6L9 17l-5-5"/></svg>
          </div>
          <h1 class="font-display font-bold text-2xl text-mts-black mb-3">Deposit Received!</h1>
          <p class="text-mts-steel text-sm mb-8">
            Your reservation is now confirmed. We'll see you at pickup — the remaining balance is due then.
          </p>
          <a routerLink="/" class="btn-primary">Back to Home</a>
        } @else if (status === 'processing') {
          <h1 class="font-display font-bold text-2xl text-mts-black mb-3">Payment Processing</h1>
          <p class="text-mts-steel text-sm mb-8">
            Your payment is being processed. We'll confirm your reservation as soon as it clears — this usually takes a few seconds.
          </p>
          <a routerLink="/" class="btn-primary">Back to Home</a>
        } @else {
          <h1 class="font-display font-bold text-2xl text-mts-black mb-3">Payment Not Completed</h1>
          <p class="text-mts-steel text-sm mb-8">
            Something went wrong and your deposit wasn't charged. Your reservation is still pending — you can try paying again.
          </p>
          <a routerLink="/vehicles" class="text-mts-blue font-accent font-semibold hover:underline">Browse vehicles</a>
        }
      </div>
    </main>

    <mts-footer></mts-footer>
  `,
})
export class PaymentSuccessComponent implements OnInit {
  checking = true;
  status: string = '';

  constructor(private route: ActivatedRoute) {}

  async ngOnInit(): Promise<void> {
    const clientSecret = this.route.snapshot.queryParamMap.get('payment_intent_client_secret');
    if (!clientSecret) {
      this.checking = false;
      return;
    }

    const stripe = await loadStripe(STRIPE_PUBLISHABLE_KEY);
    if (!stripe) {
      this.checking = false;
      return;
    }

    const { paymentIntent } = await stripe.retrievePaymentIntent(clientSecret);
    this.status = paymentIntent?.status || '';
    this.checking = false;
  }
}