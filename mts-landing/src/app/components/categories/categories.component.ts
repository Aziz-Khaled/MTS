import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'mts-categories',
  standalone: true,
  template: `
    <section id="categories" class="bg-white">
      <div class="max-w-7xl mx-auto px-6 lg:px-10 py-20 lg:py-24">
        <div class="text-center max-w-2xl mx-auto mb-14">
          <p class="section-eyebrow mb-3">Browse By Type</p>
          <h2 class="font-display font-bold text-3xl lg:text-4xl text-mts-black">Find The Right Category For You</h2>
        </div>

        <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-5">
          @for (cat of categories; track cat.name) {
            <button
              type="button"
              (click)="goTo(cat.name)"
              class="group flex flex-col items-center gap-4 bg-mts-surface rounded-card p-6 hover:bg-mts-navy transition-colors duration-300"
            >
              <span class="text-mts-navy group-hover:text-white transition-colors duration-300" [innerHTML]="cat.icon"></span>
              <span class="font-accent font-semibold text-sm text-mts-black group-hover:text-white transition-colors duration-300">{{ cat.name }}</span>
            </button>
          }
        </div>
      </div>
    </section>
  `,
})
export class CategoriesComponent {
  constructor(private router: Router) {}

  categories = [
    { name: 'SUV', icon: '<svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><path d="M3 13l1.2-4.5A2 2 0 0 1 6.1 7h9.3a2 2 0 0 1 1.9 1.4L18.5 13"/><path d="M2.5 13h19v5a1 1 0 0 1-1 1h-1a1 1 0 0 1-1-1v-1H5.5v1a1 1 0 0 1-1 1h-1a1 1 0 0 1-1-1z"/><circle cx="7" cy="16.5" r="1.1"/><circle cx="17" cy="16.5" r="1.1"/></svg>' },
    { name: 'Sedan', icon: '<svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><path d="M3 15l1-4.5c0.3-1.3 1.1-2 2.4-2.2 2.3-0.4 7-0.4 9.3 0 1.3 0.2 2.1 0.9 2.4 2.2L19 15"/><path d="M2.5 15h19v3.5a1 1 0 0 1-1 1h-1a1 1 0 0 1-1-1v-0.7H5.5v0.7a1 1 0 0 1-1 1h-1a1 1 0 0 1-1-1z"/><circle cx="7" cy="17" r="1"/><circle cx="17" cy="17" r="1"/></svg>' },
    { name: 'Luxury', icon: '<svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><path d="M4 18l2-9 2.5 4L12 6l3.5 7L18 9l2 9"/><path d="M4 18h16"/></svg>' },
    { name: 'Electric', icon: '<svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><path d="M13 2 5 13h5l-1 9 8-11h-5l1-9Z"/></svg>' },
    { name: 'Sports', icon: '<svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><path d="M3 14.5l1.5-5c0.3-1 1-1.6 2.1-1.8 2.7-0.5 8.1-0.5 10.8 0 1.1 0.2 1.8 0.8 2.1 1.8l1.5 5"/><path d="M2.5 14.5h19v3a1 1 0 0 1-1 1h-1.2a1 1 0 0 1-1-1v-0.8H5.7v0.8a1 1 0 0 1-1 1H3.5a1 1 0 0 1-1-1z"/><path d="M8 8.5V6M16 8.5V6"/></svg>' },
    { name: 'Compact', icon: '<svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><path d="M4 15l1-3.5c0.3-1 1-1.5 2.1-1.6 1.8-0.2 5-0.2 6.8 0 1.1 0.1 1.8 0.6 2.1 1.6L17 15"/><path d="M3.5 15h17v2.8a1 1 0 0 1-1 1h-0.8a1 1 0 0 1-1-1V17H6.3v0.8a1 1 0 0 1-1 1H4.5a1 1 0 0 1-1-1z"/><circle cx="7.5" cy="16.5" r="0.9"/><circle cx="15.5" cy="16.5" r="0.9"/></svg>' },
  ];

  goTo(name: string): void {
    this.router.navigate(['/vehicles'], { queryParams: { category: name.toLowerCase() } });
  }
}
