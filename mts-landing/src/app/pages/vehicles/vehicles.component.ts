import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { NavbarComponent } from '../../components/navbar/navbar.component';
import { FooterComponent } from '../../components/footer/footer.component';
import { VehicleService, Vehicle } from '../../Services/vehicle.service';

@Component({
  selector: 'mts-vehicles',
  standalone: true,
  imports: [RouterLink, FormsModule, NavbarComponent, FooterComponent],
  template: `
    <mts-navbar [alwaysSolid]="true" [showBookButton]="false"></mts-navbar>

    <main class="bg-mts-surface min-h-screen pt-32 pb-20">
      <div class="max-w-7xl mx-auto px-6 lg:px-10">
        <div class="mb-10">
          <p class="section-eyebrow mb-3">Our Fleet</p>
          <h1 class="font-display font-bold text-3xl lg:text-4xl text-mts-black mb-3">Available Vehicles</h1>
          <p class="text-mts-steel">Browse our full range and find the perfect car for your trip.</p>
        </div>

        <!-- Category filter chips -->
        <div class="flex flex-wrap gap-3 mb-8">
          @for (cat of categories; track cat.value) {
            <button
              type="button"
              (click)="selectCategory(cat.value)"
              class="px-5 py-2.5 rounded-full font-accent font-semibold text-sm transition-colors duration-300"
              [class.bg-mts-navy]="activeCategory === cat.value"
              [class.text-white]="activeCategory === cat.value"
              [class.bg-white]="activeCategory !== cat.value"
              [class.text-mts-black]="activeCategory !== cat.value"
            >{{ cat.label }}</button>
          }
        </div>

        <div class="grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-8">
          <!-- Filters sidebar -->
          <aside class="card-surface border border-mts-surface p-6 h-fit lg:sticky lg:top-32">
            <div class="flex items-center justify-between mb-6">
              <h2 class="font-display font-semibold text-lg text-mts-black">Filters</h2>
              <button type="button" (click)="resetFilters()" class="text-xs font-accent font-semibold text-mts-blue hover:underline">Reset</button>
            </div>

            <!-- Price range -->
            <div class="mb-8">
              <p class="font-accent font-semibold text-sm text-mts-black mb-1">Price per day</p>
              <p class="text-xs text-mts-steel mb-4">{{ priceMin }}€ &ndash; {{ priceMax }}€</p>

              <div class="relative h-1.5 rounded-full bg-mts-surface mb-2">
                <div
                  class="absolute h-1.5 rounded-full bg-mts-navy"
                  [style.left.%]="pricePercent(priceMin)"
                  [style.right.%]="100 - pricePercent(priceMax)"
                ></div>
              </div>

              <input
                type="range"
                [min]="dataMinPrice"
                [max]="dataMaxPrice"
                [(ngModel)]="priceMin"
                (ngModelChange)="onPriceMinChange($event)"
                class="w-full accent-mts-navy"
              />
              <input
                type="range"
                [min]="dataMinPrice"
                [max]="dataMaxPrice"
                [(ngModel)]="priceMax"
                (ngModelChange)="onPriceMaxChange($event)"
                class="w-full accent-mts-navy -mt-1"
              />
            </div>

            <!-- Transmission -->
            <div class="mb-8">
              <p class="font-accent font-semibold text-sm text-mts-black mb-3">Transmission</p>
              <div class="flex flex-col gap-2">
                @for (t of transmissionOptions; track t) {
                  <label class="flex items-center gap-2 text-sm text-mts-black cursor-pointer">
                    <input
                      type="checkbox"
                      class="accent-mts-navy"
                      [checked]="selectedTransmissions.includes(t)"
                      (change)="toggleTransmission(t)"
                    />
                    {{ t }}
                  </label>
                }
              </div>
            </div>

            <!-- Fuel type -->
            <div class="mb-8">
              <p class="font-accent font-semibold text-sm text-mts-black mb-3">Fuel Type</p>
              <div class="flex flex-col gap-2">
                @for (f of fuelOptions; track f) {
                  <label class="flex items-center gap-2 text-sm text-mts-black cursor-pointer">
                    <input
                      type="checkbox"
                      class="accent-mts-navy"
                      [checked]="selectedFuels.includes(f)"
                      (change)="toggleFuel(f)"
                    />
                    {{ f }}
                  </label>
                }
              </div>
            </div>

            <!-- Availability -->
            <div>
              <label class="flex items-center gap-2 text-sm text-mts-black cursor-pointer">
                <input type="checkbox" class="accent-mts-navy" [(ngModel)]="availableOnly" />
                Available only
              </label>
            </div>
          </aside>

          <!-- Results -->
          <div>
            @if (loading) {
              <p class="text-center text-mts-steel py-20">Loading vehicles...</p>
            } @else if (error) {
              <p class="text-center text-red-600 py-20">Could not load vehicles. Please try again later.</p>
            } @else if (filteredVehicles.length === 0) {
              <p class="text-center text-mts-steel py-20">No vehicles match your filters right now.</p>
            } @else {
              <p class="text-sm text-mts-steel mb-5">{{ filteredVehicles.length }} vehicle(s) found</p>
              <div class="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-7">
                @for (v of filteredVehicles; track v.id) {
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
        </div>
      </div>
    </main>

    <mts-footer></mts-footer>
  `,
})
export class VehiclesComponent implements OnInit {
  vehicles: Vehicle[] = [];
  loading = true;
  error = false;
  activeCategory = 'all';
  fallbackImage = 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?q=80&w=1200&auto=format&fit=crop';

  categories = [
    { label: 'All', value: 'all' },
    { label: 'Sedan', value: 'sedan' },
    { label: 'Compact', value: 'compact' },
    { label: 'SUV', value: 'suv' },
    { label: 'Luxury', value: 'luxury' },
    { label: 'Sports', value: 'sports' },
    { label: 'Electric', value: 'electric' },
  ];

  // Matches backend TransmissionType / FuelType enums exactly
  transmissionOptions = ['MANUAL', 'AUTOMATIC'];
  fuelOptions = ['PETROL', 'DIESEL', 'HYBRID', 'ELECTRIC'];

  selectedTransmissions: string[] = [];
  selectedFuels: string[] = [];
  availableOnly = false;

  // Dynamic price bounds, computed from the actual fetched data
  dataMinPrice = 0;
  dataMaxPrice = 500;
  priceMin = 0;
  priceMax = 500;

  constructor(
    private vehicleService: VehicleService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.route.queryParamMap.subscribe((params) => {
      const category = params.get('category');
      this.activeCategory = category ? category.toLowerCase() : 'all';
    });

    this.vehicleService.getAll().subscribe({
      next: (data) => {
        this.vehicles = data;
        this.setupPriceBounds(data);
        this.loading = false;
      },
      error: () => {
        this.error = true;
        this.loading = false;
      },
    });
  }

  private setupPriceBounds(vehicles: Vehicle[]): void {
    if (vehicles.length === 0) return;
    const prices = vehicles.map((v) => v.dailyPrice);
    this.dataMinPrice = Math.floor(Math.min(...prices));
    this.dataMaxPrice = Math.ceil(Math.max(...prices));
    this.priceMin = this.dataMinPrice;
    this.priceMax = this.dataMaxPrice;
  }

  pricePercent(value: number): number {
    const range = this.dataMaxPrice - this.dataMinPrice;
    if (range <= 0) return 0;
    return ((value - this.dataMinPrice) / range) * 100;
  }

  onPriceMinChange(value: number): void {
    if (value > this.priceMax) this.priceMin = this.priceMax;
  }

  onPriceMaxChange(value: number): void {
    if (value < this.priceMin) this.priceMax = this.priceMin;
  }

  toggleTransmission(value: string): void {
    this.selectedTransmissions = this.selectedTransmissions.includes(value)
      ? this.selectedTransmissions.filter((t) => t !== value)
      : [...this.selectedTransmissions, value];
  }

  toggleFuel(value: string): void {
    this.selectedFuels = this.selectedFuels.includes(value)
      ? this.selectedFuels.filter((f) => f !== value)
      : [...this.selectedFuels, value];
  }

  resetFilters(): void {
    this.selectedTransmissions = [];
    this.selectedFuels = [];
    this.availableOnly = false;
    this.priceMin = this.dataMinPrice;
    this.priceMax = this.dataMaxPrice;
  }

  get filteredVehicles(): Vehicle[] {
    return this.vehicles.filter((v) => {
      const matchesCategory =
        this.activeCategory === 'all' || v.category.toLowerCase() === this.activeCategory;

      const matchesPrice = v.dailyPrice >= this.priceMin && v.dailyPrice <= this.priceMax;

      const matchesTransmission =
        this.selectedTransmissions.length === 0 ||
        this.selectedTransmissions.includes(v.transmission);

      const matchesFuel =
        this.selectedFuels.length === 0 || this.selectedFuels.includes(v.fuel);

      const matchesAvailability = !this.availableOnly || v.bookable;

      return (
        matchesCategory &&
        matchesPrice &&
        matchesTransmission &&
        matchesFuel &&
        matchesAvailability
      );
    });
  }

  selectCategory(value: string): void {
    this.activeCategory = value;
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: { category: value === 'all' ? null : value },
      queryParamsHandling: 'merge',
    });
  }
}