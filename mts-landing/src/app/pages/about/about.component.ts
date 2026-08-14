import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { NavbarComponent } from '../../components/navbar/navbar.component';
import { FooterComponent } from '../../components/footer/footer.component';

@Component({
  selector: 'mts-about',
  standalone: true,
  imports: [RouterLink, NavbarComponent, FooterComponent],
  template: `
    <mts-navbar [alwaysSolid]="true" [showBookButton]="false"></mts-navbar>

    <main class="bg-white min-h-screen">
      <!-- Hero -->
      <section class="bg-mts-gradient pt-40 pb-20">
        <div class="max-w-4xl mx-auto px-6 lg:px-10 text-center">
          <p class="section-eyebrow text-white/70 mb-3">About MTS</p>
          <h1 class="font-display font-bold text-3xl lg:text-5xl text-white mb-5">
            Premium Mobility, Built On Trust
          </h1>
          <p class="text-white/70 text-lg max-w-2xl mx-auto">
            MTS was founded on a simple idea: renting a car should feel as premium as owning one.
            No hidden fees, no worn-out fleets, no waiting in line — just reliable vehicles and a
            team that treats every trip like it matters.
          </p>
        </div>
      </section>

      <!-- Stats recap -->
      <section class="bg-mts-surface">
        <div class="max-w-7xl mx-auto px-6 lg:px-10 py-16">
          <div class="grid grid-cols-2 lg:grid-cols-4 gap-5">
            <div class="card-surface border border-mts-surface p-7 text-center">
              <p class="font-display font-bold text-3xl text-mts-black">500+</p>
              <p class="font-accent text-sm text-mts-steel mt-2">Available Cars</p>
            </div>
            <div class="card-surface border border-mts-surface p-7 text-center">
              <p class="font-display font-bold text-3xl text-mts-black">10K+</p>
              <p class="font-accent text-sm text-mts-steel mt-2">Happy Customers</p>
            </div>
            <div class="card-surface border border-mts-surface p-7 text-center">
              <p class="font-display font-bold text-3xl text-mts-black">25+</p>
              <p class="font-accent text-sm text-mts-steel mt-2">Locations</p>
            </div>
            <div class="card-surface border border-mts-surface p-7 text-center">
              <p class="font-display font-bold text-3xl text-mts-black">5+</p>
              <p class="font-accent text-sm text-mts-steel mt-2">Years Experience</p>
            </div>
          </div>
        </div>
      </section>

      <!-- Mission / values -->
      <section class="max-w-7xl mx-auto px-6 lg:px-10 py-20 lg:py-24">
        <div class="text-center max-w-2xl mx-auto mb-14">
          <p class="section-eyebrow mb-3">Our Mission</p>
          <h2 class="font-display font-bold text-3xl lg:text-4xl text-mts-black">What Drives Us</h2>
        </div>

        <div class="grid grid-cols-1 sm:grid-cols-3 gap-7">
          <div class="text-center">
            <div class="w-14 h-14 mx-auto rounded-2xl bg-mts-navy/10 flex items-center justify-center text-mts-navy mb-5">
              <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7"><path d="M12 2l3 6.5 7 1-5.2 5 1.3 7L12 18l-6.1 3.5 1.3-7L2 9.5l7-1L12 2Z"/></svg>
            </div>
            <h3 class="font-display font-semibold text-lg text-mts-black mb-2">Quality First</h3>
            <p class="text-mts-steel text-sm leading-relaxed">Every vehicle in our fleet is inspected, maintained, and detailed before it reaches you.</p>
          </div>
          <div class="text-center">
            <div class="w-14 h-14 mx-auto rounded-2xl bg-mts-navy/10 flex items-center justify-center text-mts-navy mb-5">
              <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7"><path d="M9 12l2 2 4-4"/><circle cx="12" cy="12" r="9"/></svg>
            </div>
            <h3 class="font-display font-semibold text-lg text-mts-black mb-2">Transparent Pricing</h3>
            <p class="text-mts-steel text-sm leading-relaxed">The price you see at booking is the price you pay. No last-minute surprises at pickup.</p>
          </div>
          <div class="text-center">
            <div class="w-14 h-14 mx-auto rounded-2xl bg-mts-navy/10 flex items-center justify-center text-mts-navy mb-5">
              <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7"><circle cx="9" cy="8" r="3.2"/><path d="M2.5 20c0-3.5 2.9-6 6.5-6s6.5 2.5 6.5 6"/><circle cx="17" cy="9" r="2.5"/><path d="M15.5 14c2.9 0.3 5 2.4 5 5.5"/></svg>
            </div>
            <h3 class="font-display font-semibold text-lg text-mts-black mb-2">Customer First</h3>
            <p class="text-mts-steel text-sm leading-relaxed">Real support from real people, available whenever your trip needs a hand.</p>
          </div>
        </div>
      </section>

      <!-- CTA -->
      <section class="bg-mts-gradient-cta">
        <div class="max-w-4xl mx-auto px-6 lg:px-10 py-16 text-center">
          <h2 class="font-display font-bold text-2xl lg:text-3xl text-white mb-4">Ready to hit the road?</h2>
          <p class="text-white/70 mb-8">Browse our fleet and find the right car for your next trip.</p>
          <a routerLink="/vehicles" class="inline-flex items-center justify-center rounded-full bg-white text-mts-black font-accent font-semibold px-7 py-3.5 hover:bg-mts-surface transition-colors duration-300">
            Explore Vehicles
          </a>
        </div>
      </section>
    </main>

    <mts-footer></mts-footer>
  `,
})
export class AboutComponent {}