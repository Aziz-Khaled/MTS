import { Component, OnInit } from '@angular/core';
import { ReservationService, Reservation } from '../../../Services/reservation.service';
import { VehicleService, Vehicle } from '../../../Services/vehicle.service';
import { CustomerService, Customer } from '../../../Services/customer.service';

type StatusFilter = 'ALL' | Reservation['status'];

@Component({
  selector: 'mts-admin-reservations',
  standalone: true,
  template: `
    <div class="mb-8">
      <h1 class="font-display font-bold text-2xl lg:text-3xl text-mts-black mb-1">Reservations</h1>
      <p class="text-mts-steel text-sm">Manage bookings through their full lifecycle.</p>
    </div>

    <div class="flex flex-wrap gap-2 mb-6">
      @for (f of filters; track f) {
        <button
          type="button"
          (click)="activeFilter = f"
          class="px-4 py-2 rounded-full font-accent font-semibold text-xs transition-colors duration-300"
          [class.bg-mts-navy]="activeFilter === f"
          [class.text-white]="activeFilter === f"
          [class.bg-white]="activeFilter !== f"
          [class.text-mts-black]="activeFilter !== f"
        >{{ f }}</button>
      }
    </div>

    @if (loading) {
      <p class="text-mts-steel">Loading reservations...</p>
    } @else if (error) {
      <p class="text-red-600">Could not load reservations.</p>
    } @else if (filteredReservations.length === 0) {
      <p class="text-mts-steel">No reservations match this filter.</p>
    } @else {
      <div class="card-surface border border-mts-surface overflow-hidden">
        <table class="w-full text-sm">
          <thead class="bg-mts-surface text-left">
            <tr>
              <th class="px-5 py-3 font-accent font-semibold text-xs text-mts-steel uppercase tracking-wide">Vehicle</th>
              <th class="px-5 py-3 font-accent font-semibold text-xs text-mts-steel uppercase tracking-wide">Dates</th>
              <th class="px-5 py-3 font-accent font-semibold text-xs text-mts-steel uppercase tracking-wide">Total</th>
              <th class="px-5 py-3 font-accent font-semibold text-xs text-mts-steel uppercase tracking-wide">Status</th>
              <th class="px-5 py-3"></th>
            </tr>
          </thead>
          <tbody>
            @for (r of filteredReservations; track r.id) {
              <tr
                class="border-t border-mts-surface hover:bg-mts-surface/60 cursor-pointer transition-colors"
                (click)="openDetails(r)"
              >
                <td class="px-5 py-4">
                  <p class="font-medium text-mts-black">{{ vehicleLabel(r.vehicleId) }}</p>
                  <p class="text-xs text-mts-steel">ID: {{ r.id.slice(0, 8) }}...</p>
                </td>
                <td class="px-5 py-4 text-mts-steel">{{ r.pickupDate }} &rarr; {{ r.returnDate }}</td>
                <td class="px-5 py-4 font-medium text-mts-black">{{ r.totalPrice }}&euro;</td>
                <td class="px-5 py-4">
                  <span
                    class="text-xs font-accent font-semibold px-2.5 py-1 rounded-full"
                    [class.bg-amber-100]="r.status === 'PENDING'"
                    [class.text-amber-700]="r.status === 'PENDING'"
                    [class.bg-blue-100]="r.status === 'CONFIRMED'"
                    [class.text-blue-700]="r.status === 'CONFIRMED'"
                    [class.bg-mts-navy]="r.status === 'ACTIVE' || r.status === 'IN_PREPARATION'"
                    [class.text-white]="r.status === 'ACTIVE' || r.status === 'IN_PREPARATION'"
                    [class.bg-green-100]="r.status === 'COMPLETED'"
                    [class.text-green-700]="r.status === 'COMPLETED'"
                    [class.bg-red-100]="r.status === 'CANCELLED'"
                    [class.text-red-700]="r.status === 'CANCELLED'"
                  >{{ r.status }}</span>
                </td>
                <td class="px-5 py-4 text-right whitespace-nowrap" (click)="$event.stopPropagation()">
                  @if (r.status === 'PENDING') {
                    <button type="button" (click)="doAction('confirm', r)" class="text-mts-blue text-xs font-accent font-semibold hover:underline mr-4">Confirm</button>
                    <button type="button" (click)="doAction('cancel', r)" class="text-red-600 text-xs font-accent font-semibold hover:underline">Cancel</button>
                  } @else if (r.status === 'CONFIRMED') {
                    <button type="button" (click)="doAction('start', r)" class="text-mts-navy text-xs font-accent font-semibold hover:underline mr-4">Start Rental</button>
                    <button type="button" (click)="doAction('cancel', r)" class="text-red-600 text-xs font-accent font-semibold hover:underline">Cancel</button>
                  } @else if (r.status === 'ACTIVE') {
                    <button type="button" (click)="doAction('complete', r)" class="text-green-700 text-xs font-accent font-semibold hover:underline mr-4">Complete</button>
                    <button type="button" (click)="doAction('cancel', r)" class="text-red-600 text-xs font-accent font-semibold hover:underline">Cancel</button>
                  } @else {
                    <span class="text-xs text-mts-steel">No actions</span>
                  }
                </td>
              </tr>
            }
          </tbody>
        </table>
      </div>
    }

    <!-- Detail modal -->
    @if (selectedReservation) {
      <div class="fixed inset-0 bg-mts-black/50 z-50 flex items-center justify-center p-6" (click)="closeDetails()">
        <div class="bg-white rounded-card shadow-premium w-full max-w-lg p-8" (click)="$event.stopPropagation()">
          <div class="flex items-start justify-between mb-6">
            <h2 class="font-display font-bold text-xl text-mts-black">Reservation Details</h2>
            <button type="button" (click)="closeDetails()" class="text-mts-steel hover:text-mts-black">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="6" y1="6" x2="18" y2="18"/><line x1="6" y1="18" x2="18" y2="6"/></svg>
            </button>
          </div>

          <div class="flex flex-col gap-5">
            <div>
              <p class="text-xs font-accent font-semibold text-mts-steel uppercase tracking-wide mb-2">Vehicle</p>
              <p class="text-mts-black font-medium">{{ vehicleLabel(selectedReservation.vehicleId) }}</p>
            </div>

            <div>
              <p class="text-xs font-accent font-semibold text-mts-steel uppercase tracking-wide mb-2">Customer</p>
              @if (loadingCustomer) {
                <p class="text-sm text-mts-steel">Loading customer info...</p>
              } @else if (selectedCustomer) {
                <p class="text-mts-black font-medium">{{ selectedCustomer.firstName }} {{ selectedCustomer.lastName }}</p>
                <p class="text-sm text-mts-steel mt-1">
                  <a [href]="'tel:' + selectedCustomer.phone" class="text-mts-blue hover:underline">{{ selectedCustomer.phone }}</a>
                </p>
                <p class="text-sm text-mts-steel">
                  <a [href]="'mailto:' + selectedCustomer.email" class="text-mts-blue hover:underline">{{ selectedCustomer.email }}</a>
                </p>
                @if (selectedCustomer.blacklisted) {
                  <span class="inline-block mt-2 text-xs font-accent font-semibold px-2.5 py-1 rounded-full bg-red-100 text-red-700">Blacklisted</span>
                }
              } @else {
                <p class="text-sm text-red-600">Could not load customer info.</p>
              }
            </div>

            <div class="grid grid-cols-2 gap-4 pt-2 border-t border-mts-surface">
              <div>
                <p class="text-xs font-accent font-semibold text-mts-steel uppercase tracking-wide mb-1">Pickup</p>
                <p class="text-mts-black text-sm font-medium">{{ selectedReservation.pickupDate }}</p>
              </div>
              <div>
                <p class="text-xs font-accent font-semibold text-mts-steel uppercase tracking-wide mb-1">Return</p>
                <p class="text-mts-black text-sm font-medium">{{ selectedReservation.returnDate }}</p>
              </div>
            </div>

            <div class="flex items-center justify-between pt-2 border-t border-mts-surface">
              <span class="font-accent font-semibold text-mts-black">Total Price</span>
              <span class="font-display font-bold text-lg text-mts-navy">{{ selectedReservation.totalPrice }}&euro;</span>
            </div>

            <div class="flex items-center justify-between">
              <span class="text-sm text-mts-steel">Status</span>
              <span
                class="text-xs font-accent font-semibold px-2.5 py-1 rounded-full"
                [class.bg-amber-100]="selectedReservation.status === 'PENDING'"
                [class.text-amber-700]="selectedReservation.status === 'PENDING'"
                [class.bg-blue-100]="selectedReservation.status === 'CONFIRMED'"
                [class.text-blue-700]="selectedReservation.status === 'CONFIRMED'"
                [class.bg-mts-navy]="selectedReservation.status === 'ACTIVE' || selectedReservation.status === 'IN_PREPARATION'"
                [class.text-white]="selectedReservation.status === 'ACTIVE' || selectedReservation.status === 'IN_PREPARATION'"
                [class.bg-green-100]="selectedReservation.status === 'COMPLETED'"
                [class.text-green-700]="selectedReservation.status === 'COMPLETED'"
                [class.bg-red-100]="selectedReservation.status === 'CANCELLED'"
                [class.text-red-700]="selectedReservation.status === 'CANCELLED'"
              >{{ selectedReservation.status }}</span>
            </div>
          </div>
        </div>
      </div>
    }
  `,
})
export class AdminReservationsComponent implements OnInit {
  reservations: Reservation[] = [];
  vehicles: Vehicle[] = [];
  loading = true;
  error = false;

  activeFilter: StatusFilter = 'ALL';
  filters: StatusFilter[] = ['ALL', 'PENDING', 'CONFIRMED', 'ACTIVE', 'COMPLETED', 'CANCELLED'];

  selectedReservation: Reservation | null = null;
  selectedCustomer: Customer | null = null;
  loadingCustomer = false;
  private customerCache = new Map<string, Customer>();

  constructor(
    private reservationService: ReservationService,
    private vehicleService: VehicleService,
    private customerService: CustomerService
  ) {}

  ngOnInit(): void {
    this.loadData();
  }

  loadData(): void {
    this.loading = true;
    this.reservationService.getAll().subscribe({
      next: (reservations) => {
        this.reservations = reservations;
        this.vehicleService.getAll().subscribe({
          next: (vehicles) => {
            this.vehicles = vehicles;
            this.loading = false;
          },
          error: () => {
            this.loading = false;
          },
        });
      },
      error: () => {
        this.error = true;
        this.loading = false;
      },
    });
  }

  get filteredReservations(): Reservation[] {
    if (this.activeFilter === 'ALL') return this.reservations;
    return this.reservations.filter((r) => r.status === this.activeFilter);
  }

  vehicleLabel(vehicleId: string): string {
    const v = this.vehicles.find((veh) => veh.id === vehicleId);
    return v ? `${v.brand} ${v.model}` : vehicleId.slice(0, 8) + '...';
  }

  openDetails(reservation: Reservation): void {
    this.selectedReservation = reservation;
    this.selectedCustomer = null;

    const cached = this.customerCache.get(reservation.customerId);
    if (cached) {
      this.selectedCustomer = cached;
      return;
    }

    this.loadingCustomer = true;
    this.customerService.getById(reservation.customerId).subscribe({
      next: (customer) => {
        this.customerCache.set(reservation.customerId, customer);
        this.selectedCustomer = customer;
        this.loadingCustomer = false;
      },
      error: () => {
        this.loadingCustomer = false;
      },
    });
  }

  closeDetails(): void {
    this.selectedReservation = null;
    this.selectedCustomer = null;
  }

  doAction(action: 'confirm' | 'start' | 'complete' | 'cancel', reservation: Reservation): void {
    const call =
      action === 'confirm' ? this.reservationService.confirm(reservation.id) :
      action === 'start' ? this.reservationService.startRental(reservation.id) :
      action === 'complete' ? this.reservationService.complete(reservation.id) :
      this.reservationService.cancel(reservation.id);

    call.subscribe({
      next: () => this.loadData(),
      error: () => {},
    });
  }
}