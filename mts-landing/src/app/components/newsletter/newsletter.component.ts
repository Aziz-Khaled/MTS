import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'mts-newsletter',
  standalone: true,
  imports: [FormsModule],
  template: `
    <section class="bg-white">
      <div class="max-w-5xl mx-auto px-6 lg:px-10 pb-20 lg:pb-24">
        <div class="bg-mts-gradient-cta rounded-card px-6 py-12 lg:px-16 lg:py-14 text-center">
          <h2 class="font-display font-bold text-2xl lg:text-3xl text-white mb-3">Stay Updated With MTS</h2>
          <p class="text-white/70 mb-8">Get exclusive offers and fleet updates straight to your inbox.</p>

          <form class="flex flex-col sm:flex-row gap-3 max-w-lg mx-auto" (submit)="subscribe($event)">
            <input
              type="email"
              required
              [(ngModel)]="email"
              name="email"
              placeholder="Enter your email"
              class="flex-1 rounded-full px-5 py-3.5 text-sm text-mts-black outline-none focus:ring-2 focus:ring-white"
            />
            <button type="submit" class="rounded-full bg-mts-black text-white font-accent font-semibold px-7 py-3.5 hover:bg-mts-black/80 transition-colors duration-300">
              Subscribe
            </button>
          </form>

          @if (submitted) {
            <p class="text-white/80 text-sm mt-4">Thanks for subscribing! Check your inbox to confirm.</p>
          }
        </div>
      </div>
    </section>
  `,
})
export class NewsletterComponent {
  email = '';
  submitted = false;

  subscribe(event: Event): void {
    event.preventDefault();
    if (!this.email) return;
    this.submitted = true;
    this.email = '';
  }
}
