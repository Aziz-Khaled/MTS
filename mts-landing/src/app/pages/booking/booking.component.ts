import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { NavbarComponent } from '../../components/navbar/navbar.component';
import { FooterComponent } from '../../components/footer/footer.component';
import { VehicleService, Vehicle } from '../../Services/vehicle.service';
import { ReservationService } from '../../Services/reservation.service';

// TODO: replace with a real agency picker once the Agency entity has a frontend.
// Using the same placeholder agency id used throughout testing so far.
const DEFAULT_AGENCY_ID = '00000000-0000-0000-0000-000000000000';

@Component({
  selector: 'mts-booking',
  standalone: true,
  imports: [FormsModule, RouterLink, NavbarComponent, FooterComponent],
  template: `
    <mts-navbar [alwaysSolid]="true" [showBookButton]="false"></mts-navbar>

    <main class="bg-mts-surface min-h-screen pt-32 pb-20">
      <div class="max-w-5xl mx-auto px-6 lg:px-10">

        @if (loadingVehicle) {
          <p class="text-center text-mts-steel py-20">Loading vehicle...</p>
        } @else if (vehicleError) {
          <div class="text-center py-20">
            <p class="text-red-600 mb-4">We couldn't find that vehicle.</p>
            <a routerLink="/vehicles" class="text-mts-blue font-accent font-semibold hover:underline">Browse all vehicles</a>
          </div>
        } @else if (vehicle) {

          @if (submitted && reservationResult) {
            <!-- Confirmation state -->
            <div class="card-surface border border-mts-surface shadow-soft p-10 text-center max-w-lg mx-auto">
              <div class="w-16 h-16 mx-auto rounded-full bg-green-50 flex items-center justify-center mb-6">
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#16a34a" stroke-width="2"><path d="M20 6L9 17l-5-5"/></svg>
              </div>
              <h1 class="font-display font-bold text-2xl text-mts-black mb-3">Reservation Requested</h1>
              <p class="text-mts-steel text-sm mb-8">
                Your booking for the {{ vehicle.brand }} {{ vehicle.model }} has been submitted and is
                <span class="font-semibold text-mts-black">pending confirmation</span>.
                Total: <span class="font-semibold text-mts-black">{{ reservationResult.totalPrice }}€</span>
              </p>
              <div class="flex flex-col sm:flex-row gap-3 justify-center">
                <a routerLink="/vehicles" class="inline-flex items-center justify-center rounded-full border border-mts-navy text-mts-navy font-accent font-semibold px-7 py-3.5 hover:bg-mts-surface transition-colors duration-300">Browse More Vehicles</a>
                <a routerLink="/" class="btn-primary">Back to Home</a>
              </div>
            </div>
          } @else {
            <p class="section-eyebrow mb-3">Confirm Your Booking</p>
            <h1 class="font-display font-bold text-3xl lg:text-4xl text-mts-black mb-10">Book a Car</h1>

            <div class="grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-10">
              <!-- Booking form -->
              <div class="card-surface border border-mts-surface shadow-soft p-8">
                <h2 class="font-accent font-semibold text-sm text-mts-black mb-6 uppercase tracking-wide">Rental Dates</h2>

                <form (submit)="submit($event)" class="flex flex-col gap-6">
                  <div class="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <label class="flex flex-col gap-2">
                      <span class="text-xs font-accent font-semibold text-mts-steel uppercase tracking-wide">Pickup Date</span>
                      <input
                        type="date"
                        required
                        [min]="today"
                        [(ngModel)]="pickupDate"
                        (ngModelChange)="onDatesChange()"
                        name="pickupDate"
                        class="border border-mts-surface bg-mts-surface rounded-xl px-4 py-3 text-sm outline-none focus:border-mts-blue transition-colors"
                      />
                    </label>
                    <label class="flex flex-col gap-2">
                      <span class="text-xs font-accent font-semibold text-mts-steel uppercase tracking-wide">Return Date</span>
                      <input
                        type="date"
                        required
                        [min]="pickupDate || today"
                        [(ngModel)]="returnDate"
                        (ngModelChange)="onDatesChange()"
                        name="returnDate"
                        class="border border-mts-surface bg-mts-surface rounded-xl px-4 py-3 text-sm outline-none focus:border-mts-blue transition-colors"
                      />
                    </label>
                  </div>

                  @if (dateError) {
                    <p class="text-sm text-red-600">{{ dateError }}</p>
                  }

                  @if (submitError) {
                    <p class="text-sm text-red-600">{{ submitError }}</p>
                  }

                  <button
                    type="submit"
                    [disabled]="submitting || !!dateError || !pickupDate || !returnDate"
                    class="btn-primary w-full disabled:opacity-50"
                  >
                    {{ submitting ? 'Submitting...' : 'Confirm Reservation' }}
                  </button>

                  <p class="text-xs text-mts-steel text-center">
                    Your reservation will be <span class="font-semibold">pending</span> until confirmed by our team.
                  </p>
                </form>
              </div>

              <!-- Vehicle summary -->
              <div class="card-surface border border-mts-surface shadow-soft p-6 h-fit">
                <div class="h-40 rounded-xl overflow-hidden mb-5">
                  <img [src]="vehicle.imageUrl[0]" [alt]="vehicle.brand + ' ' + vehicle.model" class="w-full h-full object-cover" />
                </div>
                <h3 class="font-display font-semibold text-lg text-mts-black mb-1">{{ vehicle.brand }} {{ vehicle.model }}</h3>
                <p class="text-mts-steel text-sm mb-5">{{ vehicle.category }} &middot; {{ vehicle.transmission }} &middot; {{ vehicle.fuel }}</p>

                <div class="border-t border-mts-surface pt-5 flex flex-col gap-2 text-sm">
                  <div class="flex justify-between">
                    <span class="text-mts-steel">Daily rate</span>
                    <span class="text-mts-black font-medium">{{ vehicle.dailyPrice }}€</span>
                  </div>
                  <div class="flex justify-between">
                    <span class="text-mts-steel">Duration</span>
                    <span class="text-mts-black font-medium">{{ durationDays || 0 }} day(s)</span>
                  </div>
                  <div class="flex justify-between pt-3 border-t border-mts-surface mt-2">
                    <span class="font-accent font-semibold text-mts-black">Estimated Total</span>
                    <span class="font-display font-bold text-lg text-mts-navy">{{ estimatedTotal || 0 }}€</span>
                  </div>
                </div>
              </div>
            </div>
          }
        }
      </div>
    </main>

    <mts-footer></mts-footer>
  `,
})
export class BookingComponent implements OnInit {
  vehicle: Vehicle | null = null;
  loadingVehicle = true;
  vehicleError = false;

  pickupDate = '';
  returnDate = '';
  dateError = '';
  durationDays = 0;
  estimatedTotal = 0;

  submitting = false;
  submitted = false;
  submitError = '';
  reservationResult: { totalPrice: number } | null = null;

  today = new Date().toISOString().split('T')[0];

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private vehicleService: VehicleService,
    private reservationService: ReservationService
  ) {}

  ngOnInit(): void {
    const vehicleId = this.route.snapshot.queryParamMap.get('vehicleId');
    if (!vehicleId) {
      this.vehicleError = true;
      this.loadingVehicle = false;
      return;
    }

    this.vehicleService.getById(vehicleId).subscribe({
      next: (data) => {
        this.vehicle = data;
        this.loadingVehicle = false;
      },
      error: () => {
        this.vehicleError = true;
        this.loadingVehicle = false;
      },
    });
  }

  onDatesChange(): void {
    this.dateError = '';
    this.durationDays = 0;
    this.estimatedTotal = 0;

    if (!this.pickupDate || !this.returnDate || !this.vehicle) return;

    const pickup = new Date(this.pickupDate);
    const ret = new Date(this.returnDate);

    if (ret <= pickup) {
      this.dateError = 'Return date must be after pickup date.';
      return;
    }

    const days = Math.round((ret.getTime() - pickup.getTime()) / (1000 * 60 * 60 * 24));
    this.durationDays = days;
    this.estimatedTotal = Math.round(days * this.vehicle.dailyPrice * 100) / 100;
  }

  submit(event: Event): void {
    event.preventDefault();
    if (!this.vehicle || this.dateError) return;

    this.submitting = true;
    this.submitError = '';

    this.reservationService
      .create({
        vehicleId: this.vehicle.id,
        pickupAgencyId: DEFAULT_AGENCY_ID,
        returnAgencyId: DEFAULT_AGENCY_ID,
        pickupDate: this.pickupDate,
        returnDate: this.returnDate,
      })
      .subscribe({
        next: (res) => {
          this.submitting = false;
          this.submitted = true;
          this.reservationResult = res;
        },
        error: (err) => {
          this.submitting = false;
          if (err.status === 409) {
            this.submitError = 'This vehicle is already booked for part of the selected dates. Please choose different dates.';
          } else {
            this.submitError = err?.error?.message || 'Something went wrong. Please try again.';
          }
        },
      });
  }
}