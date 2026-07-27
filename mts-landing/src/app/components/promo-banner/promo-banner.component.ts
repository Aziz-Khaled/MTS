import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'mts-promo-banner',
  standalone: true,
  imports: [RouterLink],
  template: `
    <section class="bg-mts-gradient relative overflow-hidden">
      <div class="absolute -right-24 top-1/2 -translate-y-1/2 w-96 h-96 rounded-full bg-mts-blue/20 blur-3xl animate-drift"></div>
      <div class="relative max-w-7xl mx-auto px-6 lg:px-10 py-20 lg:py-24 text-center">
        <h2 class="font-display font-bold text-3xl lg:text-5xl text-white mb-4">Start Your Adventure Today</h2>
        <p class="text-white/70 text-lg max-w-xl mx-auto mb-9">Experience premium mobility with MTS</p>
        <div class="flex flex-wrap justify-center gap-4">
          <a routerLink="/register" class="inline-flex items-center justify-center rounded-full bg-white text-mts-black font-accent font-semibold px-7 py-3.5 hover:bg-mts-surface transition-colors duration-300">Get Started</a>
          <a routerLink="/vehicles" class="btn-outline">View Offers</a>
        </div>
      </div>
    </section>
  `,
})
export class PromoBannerComponent {}
