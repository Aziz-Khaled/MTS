import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { NavbarComponent } from '../../components/navbar/navbar.component';
import { FooterComponent } from '../../components/footer/footer.component';

@Component({
  selector: 'mts-services',
  standalone: true,
  imports: [RouterLink, NavbarComponent, FooterComponent],
  template: `
    <mts-navbar [alwaysSolid]="true" [showBookButton]="false"></mts-navbar>

    <main class="bg-white min-h-screen">
      <section class="bg-mts-gradient pt-40 pb-20">
        <div class="max-w-4xl mx-auto px-6 lg:px-10 text-center">
          <p class="section-eyebrow text-white/70 mb-3">What We Offer</p>
          <h1 class="font-display font-bold text-3xl lg:text-5xl text-white mb-5">Our Services</h1>
          <p class="text-white/70 text-lg max-w-2xl mx-auto">
            Whether you need a car for a weekend trip, a business meeting, or a full month,
            MTS has a rental plan built for it.
          </p>
        </div>
      </section>

      <section class="max-w-7xl mx-auto px-6 lg:px-10 py-20 lg:py-24">
        <div class="grid grid-cols-1 lg:grid-cols-3 gap-7">
          <div class="card-surface border border-mts-surface p-8 hover:shadow-premium transition-shadow duration-300">
            <div class="w-14 h-14 rounded-2xl bg-mts-navy/10 flex items-center justify-center text-mts-navy mb-6">
              <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7"><path d="M4 21V9l4-5h6l4 5v12"/><path d="M9 21v-5h6v5"/></svg>
            </div>
            <h3 class="font-display font-semibold text-xl text-mts-black mb-3">Car Rental</h3>
            <p class="text-mts-steel text-sm leading-relaxed mb-6">
              Day-to-day rentals for road trips, city breaks, or whenever you need a reliable car
              without the commitment. Pick up, drive, drop off — flexible daily and weekly rates.
            </p>
            <ul class="flex flex-col gap-2 text-sm text-mts-black mb-6">
              <li class="flex items-center gap-2"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#1E5AA8" stroke-width="2"><path d="M20 6L9 17l-5-5"/></svg>Daily &amp; weekly rates</li>
              <li class="flex items-center gap-2"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#1E5AA8" stroke-width="2"><path d="M20 6L9 17l-5-5"/></svg>Free cancellation up to 48h</li>
              <li class="flex items-center gap-2"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#1E5AA8" stroke-width="2"><path d="M20 6L9 17l-5-5"/></svg>Full fleet across all categories</li>
            </ul>
            <a routerLink="/vehicles" class="text-mts-blue font-accent font-semibold text-sm hover:underline">Browse vehicles &rarr;</a>
          </div>

          <div class="card-surface border border-mts-surface p-8 hover:shadow-premium transition-shadow duration-300">
            <div class="w-14 h-14 rounded-2xl bg-mts-navy/10 flex items-center justify-center text-mts-navy mb-6">
              <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7"><rect x="3" y="7" width="18" height="13" rx="2"/><path d="M8 7V5a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>
            </div>
            <h3 class="font-display font-semibold text-xl text-mts-black mb-3">Corporate Rental</h3>
            <p class="text-mts-steel text-sm leading-relaxed mb-6">
              Dedicated fleet plans for businesses — client meetings, airport transfers, or
              equipping your team. Centralized billing and priority support included.
            </p>
            <ul class="flex flex-col gap-2 text-sm text-mts-black mb-6">
              <li class="flex items-center gap-2"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#1E5AA8" stroke-width="2"><path d="M20 6L9 17l-5-5"/></svg>Volume discounts</li>
              <li class="flex items-center gap-2"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#1E5AA8" stroke-width="2"><path d="M20 6L9 17l-5-5"/></svg>Single monthly invoice</li>
              <li class="flex items-center gap-2"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#1E5AA8" stroke-width="2"><path d="M20 6L9 17l-5-5"/></svg>Dedicated account manager</li>
            </ul>
            <a routerLink="/contact" class="text-mts-blue font-accent font-semibold text-sm hover:underline">Talk to sales &rarr;</a>
          </div>

          <div class="card-surface border border-mts-surface p-8 hover:shadow-premium transition-shadow duration-300">
            <div class="w-14 h-14 rounded-2xl bg-mts-navy/10 flex items-center justify-center text-mts-navy mb-6">
              <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7"><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/></svg>
            </div>
            <h3 class="font-display font-semibold text-xl text-mts-black mb-3">Long Term Rental</h3>
            <p class="text-mts-steel text-sm leading-relaxed mb-6">
              Skip the hassle of ownership. Month-to-month or annual plans with maintenance,
              insurance, and roadside assistance built in.
            </p>
            <ul class="flex flex-col gap-2 text-sm text-mts-black mb-6">
              <li class="flex items-center gap-2"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#1E5AA8" stroke-width="2"><path d="M20 6L9 17l-5-5"/></svg>Maintenance included</li>
              <li class="flex items-center gap-2"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#1E5AA8" stroke-width="2"><path d="M20 6L9 17l-5-5"/></svg>Swap vehicles anytime</li>
              <li class="flex items-center gap-2"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#1E5AA8" stroke-width="2"><path d="M20 6L9 17l-5-5"/></svg>Lower monthly rate vs. daily</li>
            </ul>
            <a routerLink="/contact" class="text-mts-blue font-accent font-semibold text-sm hover:underline">Get a quote &rarr;</a>
          </div>
        </div>
      </section>

      <!-- How it works -->
      <section class="bg-mts-surface">
        <div class="max-w-7xl mx-auto px-6 lg:px-10 py-20 lg:py-24">
          <div class="text-center max-w-2xl mx-auto mb-14">
            <p class="section-eyebrow mb-3">Simple Process</p>
            <h2 class="font-display font-bold text-3xl lg:text-4xl text-mts-black">How Booking Works</h2>
          </div>

          <div class="grid grid-cols-1 sm:grid-cols-3 gap-7">
            <div class="text-center">
              <p class="font-display font-bold text-4xl text-mts-navy/20 mb-3">01</p>
              <h3 class="font-display font-semibold text-lg text-mts-black mb-2">Choose Your Car</h3>
              <p class="text-mts-steel text-sm">Browse our fleet, filter by category, price, or fuel type.</p>
            </div>
            <div class="text-center">
              <p class="font-display font-bold text-4xl text-mts-navy/20 mb-3">02</p>
              <h3 class="font-display font-semibold text-lg text-mts-black mb-2">Book &amp; Confirm</h3>
              <p class="text-mts-steel text-sm">Pick your dates, confirm your details, and reserve in minutes.</p>
            </div>
            <div class="text-center">
              <p class="font-display font-bold text-4xl text-mts-navy/20 mb-3">03</p>
              <h3 class="font-display font-semibold text-lg text-mts-black mb-2">Pick Up &amp; Drive</h3>
              <p class="text-mts-steel text-sm">Show up, grab your keys, and you're on the road.</p>
            </div>
          </div>
        </div>
      </section>
    </main>

    <mts-footer></mts-footer>
  `,
})
export class ServicesComponent {}