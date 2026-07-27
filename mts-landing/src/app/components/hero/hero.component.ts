import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'mts-hero',
  standalone: true,
  imports: [RouterLink, FormsModule],
  template: `
    <section class="relative min-h-[92vh] flex items-end overflow-hidden bg-mts-black">
      <!-- Background image -->
      <img
        src="https://images.unsplash.com/photo-1555215695-3004980ad54e?q=80&w=2000&auto=format&fit=crop"
        alt="Executive sedan on a coastal road at dusk"
        class="absolute inset-0 w-full h-full object-cover"
      />
      <!-- Overlay -->
      <div class="absolute inset-0 bg-gradient-to-t from-mts-black via-mts-black/70 to-mts-navy/40"></div>
      <div class="absolute inset-0 bg-mts-black/20"></div>

      <div class="relative z-10 w-full max-w-7xl mx-auto px-6 lg:px-10 pt-40 pb-16">
        <p class="section-eyebrow text-white/80 mb-4 animate-fadeUp">Premium Car Rental</p>
        <h1 class="font-display font-bold text-white text-4xl sm:text-5xl lg:text-6xl leading-[1.05] max-w-3xl animate-fadeUp">
          Drive Your Journey With Confidence
        </h1>
        <p class="font-body text-white/75 text-lg max-w-xl mt-6 animate-fadeUp">
          Rent premium vehicles easily with flexible booking, competitive prices, and exceptional service.
        </p>

        <div class="flex flex-wrap gap-4 mt-9 animate-fadeUp">
          <a routerLink="/vehicles" class="btn-primary">Explore Vehicles</a>
          <a routerLink="/booking" class="btn-outline">Book Now</a>
        </div>

        <!-- Floating search / booking card -->
        <div class="mt-14 lg:mt-16 card-surface shadow-premium p-6 lg:p-8 max-w-5xl animate-fadeUp">
          <div class="grid grid-cols-1 md:grid-cols-4 gap-5">
            <label class="flex flex-col gap-2">
              <span class="text-xs font-accent font-semibold text-mts-steel uppercase tracking-wide">Pickup Location</span>
              <div class="flex items-center gap-2 border border-mts-surface bg-mts-surface rounded-xl px-3 py-3 focus-within:border-mts-blue transition-colors">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#0F2747" stroke-width="2"><path d="M12 22s7-6.5 7-12a7 7 0 1 0-14 0c0 5.5 7 12 7 12Z"/><circle cx="12" cy="10" r="2.5"/></svg>
                <input
                  type="text"
                  [(ngModel)]="pickupLocation"
                  name="pickupLocation"
                  placeholder="City or airport"
                  class="bg-transparent outline-none text-sm text-mts-black placeholder:text-mts-steel w-full"
                />
              </div>
            </label>

            <label class="flex flex-col gap-2">
              <span class="text-xs font-accent font-semibold text-mts-steel uppercase tracking-wide">Pickup Date</span>
              <input
                type="date"
                [(ngModel)]="pickupDate"
                name="pickupDate"
                class="border border-mts-surface bg-mts-surface rounded-xl px-3 py-3 text-sm text-mts-black outline-none focus:border-mts-blue transition-colors"
              />
            </label>

            <label class="flex flex-col gap-2">
              <span class="text-xs font-accent font-semibold text-mts-steel uppercase tracking-wide">Return Date</span>
              <input
                type="date"
                [(ngModel)]="returnDate"
                name="returnDate"
                class="border border-mts-surface bg-mts-surface rounded-xl px-3 py-3 text-sm text-mts-black outline-none focus:border-mts-blue transition-colors"
              />
            </label>

            <label class="flex flex-col gap-2">
              <span class="text-xs font-accent font-semibold text-mts-steel uppercase tracking-wide">Vehicle Type</span>
              <select
                [(ngModel)]="vehicleType"
                name="vehicleType"
                class="border border-mts-surface bg-mts-surface rounded-xl px-3 py-3 text-sm text-mts-black outline-none focus:border-mts-blue transition-colors"
              >
                <option value="">All types</option>
                <option value="suv">SUV</option>
                <option value="sedan">Sedan</option>
                <option value="luxury">Luxury</option>
                <option value="electric">Electric</option>
                <option value="sports">Sports</option>
              </select>
            </label>
          </div>

          <button
            type="button"
            (click)="search()"
            class="btn-primary w-full md:w-auto mt-6"
          >
            Search Available Cars
          </button>
        </div>
      </div>
    </section>
  `,
})
export class HeroComponent {
  pickupLocation = '';
  pickupDate = '';
  returnDate = '';
  vehicleType = '';

  search(): void {
    const params = new URLSearchParams();
    if (this.pickupLocation) params.set('location', this.pickupLocation);
    if (this.pickupDate) params.set('pickup', this.pickupDate);
    if (this.returnDate) params.set('return', this.returnDate);
    if (this.vehicleType) params.set('category', this.vehicleType);
    window.location.href = `/vehicles?${params.toString()}`;
  }
}
