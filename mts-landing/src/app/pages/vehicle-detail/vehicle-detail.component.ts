import { Component, HostListener, OnInit } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { NavbarComponent } from '../../components/navbar/navbar.component';
import { FooterComponent } from '../../components/footer/footer.component';
import { VehicleService, Vehicle } from '../../Services/vehicle.service';

@Component({
  selector: 'mts-vehicle-detail',
  standalone: true,
  imports: [RouterLink, NavbarComponent, FooterComponent],
  template: `
    <mts-navbar [alwaysSolid]="true" [showBookButton]="false"></mts-navbar>

    <main class="bg-mts-surface min-h-screen pt-32 pb-20">
      <div class="max-w-7xl mx-auto px-6 lg:px-10">

        @if (loading) {
          <p class="text-center text-mts-steel py-20">Loading vehicle...</p>
        } @else if (error) {
          <div class="text-center py-20">
            <p class="text-red-600 mb-4">This vehicle could not be found.</p>
            <a routerLink="/vehicles" class="text-mts-blue font-accent font-semibold hover:underline">Back to all vehicles</a>
          </div>
        } @else if (vehicle) {
          <a routerLink="/vehicles" class="inline-flex items-center gap-2 text-sm font-accent font-semibold text-mts-steel hover:text-mts-navy mb-8 transition-colors">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M15 18l-6-6 6-6"/></svg>
            Back to all vehicles
          </a>

          <div class="grid grid-cols-1 lg:grid-cols-2 gap-10">
            <!-- Image carousel -->
            <div>
              <div
                class="relative h-80 lg:h-[420px] rounded-card overflow-hidden shadow-soft mb-4 group select-none"
                (touchstart)="onTouchStart($event)"
                (touchend)="onTouchEnd($event)"
              >
                <!-- Slides -->
                <div
                  class="flex h-full transition-transform duration-500 ease-out"
                  [style.transform]="'translateX(-' + (activeIndex * 100) + '%)'"
                >
                  @for (img of vehicle.imageUrl; track img) {
                    <img [src]="img" [alt]="vehicle.brand + ' ' + vehicle.model" class="w-full h-full flex-shrink-0 object-cover" />
                  }
                </div>

                <!-- Badges -->
                <span class="absolute top-4 left-4 bg-mts-navy text-white text-xs font-accent font-semibold px-3 py-1.5 rounded-full">{{ vehicle.category }}</span>
                <span
                  class="absolute top-4 right-4 text-xs font-accent font-semibold px-3 py-1.5 rounded-full"
                  [class.bg-white]="vehicle.bookable"
                  [class.text-mts-blue]="vehicle.bookable"
                  [class.bg-mts-steel]="!vehicle.bookable"
                  [class.text-white]="!vehicle.bookable"
                >{{ vehicle.bookable ? 'Available' : 'Booked' }}</span>

                <!-- Prev / Next arrows -->
                @if (vehicle.imageUrl.length > 1) {
                  <button
                    type="button"
                    (click)="prevImage()"
                    aria-label="Previous photo"
                    class="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/90 flex items-center justify-center shadow-soft opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                  >
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#0B0F14" stroke-width="2"><path d="M15 18l-6-6 6-6"/></svg>
                  </button>
                  <button
                    type="button"
                    (click)="nextImage()"
                    aria-label="Next photo"
                    class="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/90 flex items-center justify-center shadow-soft opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                  >
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#0B0F14" stroke-width="2"><path d="M9 6l6 6-6 6"/></svg>
                  </button>

                  <!-- Counter -->
                  <span class="absolute bottom-4 right-4 bg-mts-black/70 text-white text-xs font-accent font-semibold px-3 py-1 rounded-full">
                    {{ activeIndex + 1 }} / {{ vehicle.imageUrl.length }}
                  </span>

                  <!-- Dot indicators -->
                  <div class="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
                    @for (img of vehicle.imageUrl; track img; let i = $index) {
                      <button
                        type="button"
                        (click)="goToImage(i)"
                        [attr.aria-label]="'Go to photo ' + (i + 1)"
                        class="w-2 h-2 rounded-full transition-colors duration-300"
                        [style.backgroundColor]="activeIndex === i ? '#FFFFFF' : 'rgba(255,255,255,0.5)'"
                      ></button>
                    }
                  </div>
                }
              </div>

              @if (vehicle.imageUrl.length > 1) {
                <div class="grid grid-cols-4 gap-3">
                  @for (img of vehicle.imageUrl; track img; let i = $index) {
                    <button
                      type="button"
                      (click)="goToImage(i)"
                      class="h-20 rounded-xl overflow-hidden border-2 transition-colors"
                      [class.border-mts-navy]="activeIndex === i"
                      [class.border-transparent]="activeIndex !== i"
                    >
                      <img [src]="img" [alt]="vehicle.brand + ' thumbnail ' + (i + 1)" class="w-full h-full object-cover" />
                    </button>
                  }
                </div>
              }
            </div>

            <!-- Details -->
            <div>
              <div class="flex items-start justify-between mb-2">
                <h1 class="font-display font-bold text-3xl lg:text-4xl text-mts-black">{{ vehicle.brand }} {{ vehicle.model }}</h1>
                <span class="font-accent text-mts-steel text-lg">{{ vehicle.year }}</span>
              </div>

              <p class="font-display font-bold text-3xl text-mts-navy mb-8">
                {{ vehicle.dailyPrice }}€<span class="text-base font-body font-normal text-mts-steel">/day</span>
              </p>

              <div class="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-8">
                <div class="card-surface border border-mts-surface p-4 text-center">
                  <svg class="mx-auto mb-2 text-mts-navy" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/></svg>
                  <p class="font-accent font-semibold text-sm text-mts-black">{{ vehicle.transmission }}</p>
                  <p class="text-xs text-mts-steel">Transmission</p>
                </div>
                <div class="card-surface border border-mts-surface p-4 text-center">
                  <svg class="mx-auto mb-2 text-mts-navy" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M4 21V9l4-5h6l4 5v12"/><path d="M4 13h14"/></svg>
                  <p class="font-accent font-semibold text-sm text-mts-black">{{ vehicle.fuel }}</p>
                  <p class="text-xs text-mts-steel">Fuel Type</p>
                </div>
                <div class="card-surface border border-mts-surface p-4 text-center">
                  <svg class="mx-auto mb-2 text-mts-navy" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><circle cx="12" cy="8" r="3.2"/><path d="M5 20c0-3 3-5.5 7-5.5s7 2.5 7 5.5"/></svg>
                  <p class="font-accent font-semibold text-sm text-mts-black">{{ vehicle.seats }}</p>
                  <p class="text-xs text-mts-steel">Seats</p>
                </div>
              </div>

              <div class="card-surface border border-mts-surface p-6 mb-8">
                <h2 class="font-accent font-semibold text-sm text-mts-black mb-4 uppercase tracking-wide">Vehicle Details</h2>
                <dl class="grid grid-cols-2 gap-y-3 text-sm">
                  <dt class="text-mts-steel">Registration Number</dt>
                  <dd class="text-mts-black font-medium text-right">{{ vehicle.registrationNumber }}</dd>
                  <dt class="text-mts-steel">Category</dt>
                  <dd class="text-mts-black font-medium text-right">{{ vehicle.category }}</dd>
                  <dt class="text-mts-steel">Status</dt>
                  <dd class="text-mts-black font-medium text-right">{{ vehicle.status }}</dd>
                </dl>
              </div>

              <div class="flex gap-4">
                <a
                [routerLink]="['/booking']"
                [queryParams]="{ vehicleId: vehicle.id }"
                class="flex-1 text-center py-4 rounded-full bg-mts-navy text-white font-accent font-semibold hover:bg-mts-blue transition-colors"
                [class.pointer-events-none]="!vehicle.bookable"
                [class.opacity-50]="!vehicle.bookable"
                >{{ vehicle.bookable ? 'Rent This Car' : 'Currently Unavailable' }}</a>
              </div>
            </div>
          </div>
        }
      </div>
    </main>

    <mts-footer></mts-footer>
  `,
})
export class VehicleDetailComponent implements OnInit {
  vehicle: Vehicle | null = null;
  activeIndex = 0;
  loading = true;
  error = false;

  private touchStartX = 0;

  constructor(
    private route: ActivatedRoute,
    private vehicleService: VehicleService
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (!id) {
      this.error = true;
      this.loading = false;
      return;
    }

    this.vehicleService.getById(id).subscribe({
      next: (data) => {
        this.vehicle = data;
        this.activeIndex = 0;
        this.loading = false;
      },
      error: () => {
        this.error = true;
        this.loading = false;
      },
    });
  }

  goToImage(index: number): void {
    this.activeIndex = index;
  }

  nextImage(): void {
    if (!this.vehicle) return;
    this.activeIndex = (this.activeIndex + 1) % this.vehicle.imageUrl.length;
  }

  prevImage(): void {
    if (!this.vehicle) return;
    this.activeIndex =
      (this.activeIndex - 1 + this.vehicle.imageUrl.length) % this.vehicle.imageUrl.length;
  }

  @HostListener('window:keydown', ['$event'])
  onKeydown(event: KeyboardEvent): void {
    if (!this.vehicle || this.vehicle.imageUrl.length <= 1) return;
    if (event.key === 'ArrowRight') this.nextImage();
    if (event.key === 'ArrowLeft') this.prevImage();
  }

  onTouchStart(event: TouchEvent): void {
    this.touchStartX = event.changedTouches[0].clientX;
  }

  onTouchEnd(event: TouchEvent): void {
    const deltaX = event.changedTouches[0].clientX - this.touchStartX;
    const swipeThreshold = 50;
    if (deltaX > swipeThreshold) this.prevImage();
    else if (deltaX < -swipeThreshold) this.nextImage();
  }
}