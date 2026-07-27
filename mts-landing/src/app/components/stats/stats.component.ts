import { Component } from '@angular/core';

@Component({
  selector: 'mts-stats',
  standalone: true,
  template: `
    <section class="relative -mt-1 bg-white">
      <div class="max-w-7xl mx-auto px-6 lg:px-10 py-16 lg:py-20">
        <div class="grid grid-cols-2 lg:grid-cols-4 gap-5">
          @for (stat of stats; track stat.label) {
            <div class="card-surface border border-mts-surface p-7 text-center hover:shadow-premium transition-shadow duration-300">
              <div class="flex justify-center mb-4 text-mts-blue">
                <span [innerHTML]="stat.icon"></span>
              </div>
              <p class="font-display font-bold text-3xl lg:text-4xl text-mts-black">{{ stat.value }}</p>
              <p class="font-accent text-sm text-mts-steel mt-2">{{ stat.label }}</p>
            </div>
          }
        </div>
      </div>
    </section>
  `,
})
export class StatsComponent {
  stats = [
    {
      value: '500+',
      label: 'Available Cars',
      icon: '<svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M3 13l1.5-5.5A2 2 0 0 1 6.4 6h11.2a2 2 0 0 1 1.9 1.5L21 13"/><path d="M3 13h18v5a1 1 0 0 1-1 1h-1a1 1 0 0 1-1-1v-1H6v1a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1z"/><circle cx="7.5" cy="16.5" r="1.2"/><circle cx="16.5" cy="16.5" r="1.2"/></svg>',
    },
    {
      value: '10K+',
      label: 'Happy Customers',
      icon: '<svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><circle cx="9" cy="8" r="3.2"/><path d="M2.5 20c0-3.5 2.9-6 6.5-6s6.5 2.5 6.5 6"/><circle cx="17" cy="9" r="2.5"/><path d="M15.5 14c2.9 0.3 5 2.4 5 5.5"/></svg>',
    },
    {
      value: '25+',
      label: 'Locations',
      icon: '<svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M12 22s7-6.5 7-12a7 7 0 1 0-14 0c0 5.5 7 12 7 12Z"/><circle cx="12" cy="10" r="2.5"/></svg>',
    },
    {
      value: '5+',
      label: 'Years Experience',
      icon: '<svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3.5 2"/></svg>',
    },
  ];
}
