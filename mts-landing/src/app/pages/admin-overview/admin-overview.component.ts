import { Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { forkJoin } from 'rxjs';
import { VehicleService, Vehicle } from '../../Services/vehicle.service';
import { ReservationService, Reservation } from '../../Services/reservation.service';

@Component({
  selector: 'mts-admin-overview',
  standalone: true,
  imports: [RouterLink],
  template: `
    <div class="mb-8">
      <h1 class="font-display font-bold text-2xl lg:text-3xl text-mts-black mb-1">Overview</h1>
      <p class="text-mts-steel text-sm">A snapshot of your fleet and business activity.</p>
    </div>

    @if (loading) {
      <p class="text-mts-steel">Loading dashboard...</p>
    } @else if (error) {
      <p class="text-red-600">Could not load dashboard data.</p>
    } @else {
      <div class="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5 mb-10">
        <div class="card-surface border border-mts-surface p-6">
          <p class="font-accent text-xs text-mts-steel uppercase tracking-wide mb-2">Total Fleet</p>
          <p class="font-display font-bold text-3xl text-mts-black">{{ totalVehicles }}</p>
        </div>
        <div class="card-surface border border-mts-surface p-6">
          <p class="font-accent text-xs text-mts-steel uppercase tracking-wide mb-2">Available Now</p>
          <p class="font-display font-bold text-3xl text-mts-black">{{ availableVehicles }}</p>
        </div>
        <div class="card-surface border border-mts-surface p-6">
          <p class="font-accent text-xs text-mts-steel uppercase tracking-wide mb-2">Pending Reservations</p>
          <p class="font-display font-bold text-3xl text-mts-navy">{{ pendingReservations }}</p>
        </div>
        <div class="card-surface border border-mts-surface p-6">
          <p class="font-accent text-xs text-mts-steel uppercase tracking-wide mb-2">Revenue (Confirmed+)</p>
          <p class="font-display font-bold text-3xl text-mts-black">{{ revenue }}&euro;</p>
        </div>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div class="card-surface border border-mts-surface p-6">
          <div class="flex items-center justify-between mb-5">
            <h2 class="font-accent font-semibold text-sm text-mts-black uppercase tracking-wide">Fleet by Category</h2>
          </div>
          <div class="flex flex-col gap-3">
            @for (row of categoryBreakdown; track row.category) {
              <div>
                <div class="flex justify-between text-xs mb-1">
                  <span class="text-mts-black font-medium">{{ row.category }}</span>
                  <span class="text-mts-steel">{{ row.count }}</span>
                </div>
                <div class="h-1.5 rounded-full bg-mts-surface">
                  <div class="h-1.5 rounded-full bg-mts-navy" [style.width.%]="(row.count / totalVehicles) * 100"></div>
                </div>
              </div>
            }
          </div>
        </div>

        <div class="card-surface border border-mts-surface p-6">
          <div class="flex items-center justify-between mb-5">
            <h2 class="font-accent font-semibold text-sm text-mts-black uppercase tracking-wide">Recent Reservations</h2>
            <a routerLink="/admin/vehicles" class="text-xs font-accent font-semibold text-mts-blue hover:underline">Manage Fleet</a>
          </div>
          @if (recentReservations.length === 0) {
            <p class="text-sm text-mts-steel">No reservations yet.</p>
          } @else {
            <div class="flex flex-col gap-3">
              @for (r of recentReservations; track r.id) {
                <div class="flex items-center justify-between text-sm border-b border-mts-surface pb-3 last:border-0 last:pb-0">
                  <div>
                    <p class="text-mts-black font-medium">{{ r.pickupDate }} &rarr; {{ r.returnDate }}</p>
                    <p class="text-mts-steel text-xs">{{ r.totalPrice }}&euro;</p>
                  </div>
                  <span
                    class="text-xs font-accent font-semibold px-2.5 py-1 rounded-full"
                    [class.bg-amber-100]="r.status === 'PENDING'"
                    [class.text-amber-700]="r.status === 'PENDING'"
                    [class.bg-green-100]="r.status === 'CONFIRMED' || r.status === 'COMPLETED'"
                    [class.text-green-700]="r.status === 'CONFIRMED' || r.status === 'COMPLETED'"
                    [class.bg-mts-surface]="r.status === 'CANCELLED' || r.status === 'ACTIVE' || r.status === 'IN_PREPARATION'"
                    [class.text-mts-steel]="r.status === 'CANCELLED' || r.status === 'ACTIVE' || r.status === 'IN_PREPARATION'"
                  >{{ r.status }}</span>
                </div>
              }
            </div>
          }
        </div>
      </div>
    }
  `,
})
export class AdminOverviewComponent implements OnInit {
  loading = true;
  error = false;

  totalVehicles = 0;
  availableVehicles = 0;
  pendingReservations = 0;
  revenue = 0;
  categoryBreakdown: { category: string; count: number }[] = [];
  recentReservations: Reservation[] = [];

  constructor(
    private vehicleService: VehicleService,
    private reservationService: ReservationService
  ) {}

  ngOnInit(): void {
    forkJoin({
      vehicles: this.vehicleService.getAll(),
      reservations: this.reservationService.getAll(),
    }).subscribe({
      next: ({ vehicles, reservations }) => {
        this.computeVehicleStats(vehicles);
        this.computeReservationStats(reservations);
        this.loading = false;
      },
      error: () => {
        this.error = true;
        this.loading = false;
      },
    });
  }

  private computeVehicleStats(vehicles: Vehicle[]): void {
    this.totalVehicles = vehicles.length;
    this.availableVehicles = vehicles.filter((v) => v.bookable).length;

    const counts = new Map<string, number>();
    for (const v of vehicles) {
      counts.set(v.category, (counts.get(v.category) || 0) + 1);
    }
    this.categoryBreakdown = Array.from(counts.entries()).map(([category, count]) => ({ category, count }));
  }

  private computeReservationStats(reservations: Reservation[]): void {
    this.pendingReservations = reservations.filter((r) => r.status === 'PENDING').length;

    this.revenue = reservations
      .filter((r) => ['CONFIRMED', 'IN_PREPARATION', 'ACTIVE', 'COMPLETED'].includes(r.status))
      .reduce((sum, r) => sum + r.totalPrice, 0);

    this.recentReservations = [...reservations]
      .sort((a, b) => b.pickupDate.localeCompare(a.pickupDate))
      .slice(0, 5);
  }
}