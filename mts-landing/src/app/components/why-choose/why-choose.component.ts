import { Component } from '@angular/core';

@Component({
  selector: 'mts-why-choose',
  standalone: true,
  template: `
    <section id="why-choose" class="bg-mts-surface">
      <div class="max-w-7xl mx-auto px-6 lg:px-10 py-20 lg:py-24">
        <div class="text-center max-w-2xl mx-auto mb-14">
          <p class="section-eyebrow mb-3">Why MTS</p>
          <h2 class="font-display font-bold text-3xl lg:text-4xl text-mts-black">Why Choose MTS</h2>
        </div>

        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          @for (f of features; track f.title) {
            <div class="bg-white rounded-card p-7 text-center hover:shadow-premium transition-shadow duration-300">
              <div class="w-14 h-14 mx-auto rounded-2xl bg-mts-navy/10 flex items-center justify-center text-mts-navy mb-5">
                <span [innerHTML]="f.icon"></span>
              </div>
              <h3 class="font-display font-semibold text-lg text-mts-black mb-2">{{ f.title }}</h3>
              <p class="text-mts-steel text-sm leading-relaxed">{{ f.description }}</p>
            </div>
          }
        </div>
      </div>
    </section>
  `,
})
export class WhyChooseComponent {
  features = [
    { title: 'Easy Booking', description: 'Fast online reservation.', icon: '<svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7"><rect x="3" y="5" width="18" height="16" rx="2"/><path d="M3 10h18M8 3v4M16 3v4"/><path d="M8 14l2.5 2.5L16 11"/></svg>' },
    { title: 'Premium Vehicles', description: 'Well-maintained cars.', icon: '<svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7"><path d="M4 21V9l4-5h6l4 5v12"/><path d="M9 21v-5h6v5"/></svg>' },
    { title: 'Affordable Prices', description: 'Competitive rental rates.', icon: '<svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7"><circle cx="12" cy="12" r="9"/><path d="M9.5 15.5c0.5 1 1.4 1.5 2.5 1.5 1.7 0 3-1 3-2.3 0-3-6-1.5-6-4.4C9 9 10.3 8 12 8c1.1 0 2 0.5 2.5 1.5M12 6.5v11"/></svg>' },
    { title: '24/7 Support', description: 'Always available assistance.', icon: '<svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7"><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/></svg>' },
  ];
}
