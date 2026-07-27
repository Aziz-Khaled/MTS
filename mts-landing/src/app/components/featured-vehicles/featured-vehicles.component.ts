import { Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { VehicleService, Vehicle } from '../../Services/vehicle.service';

@Component({
  selector: 'mts-featured-vehicles',
  standalone: true,
  imports: [RouterLink],
  template: `
    <section class="bg-mts-surface">
      <div class="max-w-7xl mx-auto px-6 lg:px-10 py-20 lg:py-28">
        <div class="text-center max-w-2xl mx-auto mb-14">
          <p class="section-eyebrow mb-3">Our Fleet</p>
          <h2 class="font-display font-bold text-3xl lg:text-4xl text-mts-black">Explore Our Premium Fleet</h2>
          <p class="text-mts-steel mt-4">Choose from a wide selection of reliable and comfortable vehicles.</p>
        </div>

        @if (loading) {
          <p class="text-center text-mts-steel">Loading vehicles...</p>
        } @else if (error) {
          <p class="text-center text-red-600">Could not load vehicles. Please try again later.</p>
        } @else {
          <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-7">
            @for (v of vehicles; track v.id) {
              <article class="bg-white rounded-card shadow-soft overflow-hidden group hover:-translate-y-2 hover:shadow-premium transition-all duration-300">
                <div class="relative h-52 overflow-hidden">
                  <img
                    [src]="v.imageUrl[0] || fallbackImage"
                    [alt]="v.brand + ' ' + v.model"
                    class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <span class="absolute top-3 left-3 bg-mts-navy text-white text-xs font-accent font-semibold px-3 py-1.5 rounded-full">{{ v.category }}</span>
                  <span
                    class="absolute top-3 right-3 text-xs font-accent font-semibold px-3 py-1.5 rounded-full"
                    [class.bg-white]="v.bookable"
                    [class.text-mts-blue]="v.bookable"
                    [class.bg-mts-steel]="!v.bookable"
                    [class.text-white]="!v.bookable"
                  >{{ v.bookable ? 'Available' : 'Booked' }}</span>
                </div>

                <div class="p-6">
                  <div class="flex items-center justify-between mb-4">
                    <h3 class="font-display font-semibold text-lg text-mts-black">{{ v.brand }} {{ v.model }}</h3>
                    <span class="text-mts-steel text-sm font-accent">{{ v.year }}</span>
                  </div>

                  <div class="grid grid-cols-3 gap-2 text-xs font-accent text-mts-steel mb-5 pb-5 border-b border-mts-surface">
                    <span class="flex items-center gap-1.5">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/></svg>
                      {{ v.transmission }}
                    </span>
                    <span class="flex items-center gap-1.5">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M4 21V9l4-5h6l4 5v12"/><path d="M4 13h14"/></svg>
                      {{ v.fuel }}
                    </span>
                    <span class="flex items-center gap-1.5">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><circle cx="12" cy="8" r="3.2"/><path d="M5 20c0-3 3-5.5 7-5.5s7 2.5 7 5.5"/></svg>
                      {{ v.seats }} Seats
                    </span>
                  </div>

                  <div class="flex items-center justify-between mb-5">
                    <p class="font-display font-bold text-xl text-mts-black">{{ v.dailyPrice }}€<span class="text-sm font-body font-normal text-mts-steel">/day</span></p>
                  </div>

                  <div class="flex gap-3">
                    <a [routerLink]="['/vehicles', v.id]" class="flex-1 text-center py-3 rounded-full border border-mts-navy text-mts-navy font-accent font-semibold text-sm hover:bg-mts-surface transition-colors">View Details</a>
                    <a routerLink="/booking" class="flex-1 text-center py-3 rounded-full bg-mts-navy text-white font-accent font-semibold text-sm hover:bg-mts-blue transition-colors">Rent Now</a>
                  </div>
                </div>
              </article>
            }
          </div>
        }
      </div>
    </section>
  `,
})
export class FeaturedVehiclesComponent implements OnInit {
  vehicles: Vehicle[] = [];
  loading = true;
  error = false;
  fallbackImage = 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?q=80&w=1200&auto=format&fit=crop';

  constructor(private vehicleService: VehicleService) {}

  ngOnInit(): void {
    this.vehicleService.getAll().subscribe({
      next: (data) => {
        this.vehicles = data;
        this.loading = false;
      },
      error: () => {
        this.error = true;
        this.loading = false;
      },
    });
  }
}