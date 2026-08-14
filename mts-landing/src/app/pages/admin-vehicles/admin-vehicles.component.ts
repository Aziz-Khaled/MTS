import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { VehicleService, Vehicle, VehiclePayload } from '../../Services/vehicle.service';

type FormState = VehiclePayload;

const EMPTY_FORM: FormState = {
  brand: '',
  model: '',
  year: new Date().getFullYear(),
  category: 'SEDAN',
  transmission: 'AUTOMATIC',
  fuel: 'PETROL',
  seats: 5,
  vin: '',
  registrationNumber: '',
  dailyPrice: 0,
  agencyId: '00000000-0000-0000-0000-000000000000',
  imageUrl: [],
};

@Component({
  selector: 'mts-admin-vehicles',
  standalone: true,
  imports: [FormsModule],
  template: `
    <div class="flex items-center justify-between mb-8">
      <div>
        <h1 class="font-display font-bold text-2xl lg:text-3xl text-mts-black mb-1">Vehicles</h1>
        <p class="text-mts-steel text-sm">Manage your fleet — add, edit, or remove vehicles.</p>
      </div>
      <button type="button" (click)="openCreate()" class="btn-primary">+ Add Vehicle</button>
    </div>

    @if (loading) {
      <p class="text-mts-steel">Loading vehicles...</p>
    } @else if (error) {
      <p class="text-red-600">Could not load vehicles.</p>
    } @else {
      <div class="card-surface border border-mts-surface overflow-hidden">
        <table class="w-full text-sm">
          <thead class="bg-mts-surface text-left">
            <tr>
              <th class="px-5 py-3 font-accent font-semibold text-xs text-mts-steel uppercase tracking-wide">Vehicle</th>
              <th class="px-5 py-3 font-accent font-semibold text-xs text-mts-steel uppercase tracking-wide">Category</th>
              <th class="px-5 py-3 font-accent font-semibold text-xs text-mts-steel uppercase tracking-wide">Price/day</th>
              <th class="px-5 py-3 font-accent font-semibold text-xs text-mts-steel uppercase tracking-wide">Status</th>
              <th class="px-5 py-3 font-accent font-semibold text-xs text-mts-steel uppercase tracking-wide">Photos</th>
              <th class="px-5 py-3"></th>
            </tr>
          </thead>
          <tbody>
            @for (v of vehicles; track v.id) {
              <tr class="border-t border-mts-surface">
                <td class="px-5 py-4">
                  <div class="flex items-center gap-3">
                    <div class="w-14 h-10 rounded-lg overflow-hidden bg-mts-surface flex-shrink-0">
                      @if (v.imageUrl[0]) {
                        <img [src]="v.imageUrl[0]" [alt]="v.brand" class="w-full h-full object-cover" />
                      }
                    </div>
                    <div>
                      <p class="font-medium text-mts-black">{{ v.brand }} {{ v.model }}</p>
                      <p class="text-xs text-mts-steel">{{ v.year }} &middot; {{ v.vin }}</p>
                    </div>
                  </div>
                </td>
                <td class="px-5 py-4 text-mts-steel">{{ v.category }}</td>
                <td class="px-5 py-4 font-medium text-mts-black">{{ v.dailyPrice }}&euro;</td>
                <td class="px-5 py-4">
                  <span
                    class="text-xs font-accent font-semibold px-2.5 py-1 rounded-full"
                    [class.bg-green-100]="v.status === 'AVAILABLE'"
                    [class.text-green-700]="v.status === 'AVAILABLE'"
                    [class.bg-mts-surface]="v.status !== 'AVAILABLE'"
                    [class.text-mts-steel]="v.status !== 'AVAILABLE'"
                  >{{ v.status }}</span>
                </td>
                <td class="px-5 py-4">
                  <label class="text-mts-blue text-xs font-accent font-semibold cursor-pointer hover:underline">
                    {{ v.imageUrl.length }} photo(s) &middot; Add
                    <input type="file" accept="image/*" multiple class="hidden" (change)="onPhotosSelected($event, v)" />
                  </label>
                </td>
                <td class="px-5 py-4 text-right whitespace-nowrap">
                  <button type="button" (click)="openEdit(v)" class="text-mts-navy text-xs font-accent font-semibold hover:underline mr-4">Edit</button>
                  <button type="button" (click)="confirmDelete(v)" class="text-red-600 text-xs font-accent font-semibold hover:underline">Delete</button>
                </td>
              </tr>
            }
          </tbody>
        </table>
      </div>
    }

    <!-- Add / Edit modal -->
    @if (modalOpen) {
      <div class="fixed inset-0 bg-mts-black/50 z-50 flex items-center justify-center p-6" (click)="closeModal()">
        <div class="bg-white rounded-card shadow-premium w-full max-w-2xl max-h-[90vh] overflow-y-auto p-8" (click)="$event.stopPropagation()">
          <h2 class="font-display font-bold text-xl text-mts-black mb-6">{{ editingId ? 'Edit Vehicle' : 'Add Vehicle' }}</h2>

          <form (submit)="saveVehicle($event)" class="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <label class="flex flex-col gap-2">
              <span class="text-xs font-accent font-semibold text-mts-steel uppercase tracking-wide">Brand</span>
              <input type="text" required [(ngModel)]="form.brand" name="brand" class="border border-mts-surface bg-mts-surface rounded-xl px-4 py-2.5 text-sm outline-none focus:border-mts-blue" />
            </label>
            <label class="flex flex-col gap-2">
              <span class="text-xs font-accent font-semibold text-mts-steel uppercase tracking-wide">Model</span>
              <input type="text" required [(ngModel)]="form.model" name="model" class="border border-mts-surface bg-mts-surface rounded-xl px-4 py-2.5 text-sm outline-none focus:border-mts-blue" />
            </label>

            <label class="flex flex-col gap-2">
              <span class="text-xs font-accent font-semibold text-mts-steel uppercase tracking-wide">Year</span>
              <input type="number" required [(ngModel)]="form.year" name="year" class="border border-mts-surface bg-mts-surface rounded-xl px-4 py-2.5 text-sm outline-none focus:border-mts-blue" />
            </label>
            <label class="flex flex-col gap-2">
              <span class="text-xs font-accent font-semibold text-mts-steel uppercase tracking-wide">Seats</span>
              <input type="number" required [(ngModel)]="form.seats" name="seats" class="border border-mts-surface bg-mts-surface rounded-xl px-4 py-2.5 text-sm outline-none focus:border-mts-blue" />
            </label>

            <label class="flex flex-col gap-2">
              <span class="text-xs font-accent font-semibold text-mts-steel uppercase tracking-wide">Category</span>
              <select required [(ngModel)]="form.category" name="category" class="border border-mts-surface bg-mts-surface rounded-xl px-4 py-2.5 text-sm outline-none focus:border-mts-blue">
                <option value="SEDAN">Sedan</option>
                <option value="COMPACT">Compact</option>
                <option value="SUV">SUV</option>
                <option value="LUXURY">Luxury</option>
                <option value="SPORTS">Sports</option>
                <option value="ELECTRIC">Electric</option>
              </select>
            </label>
            <label class="flex flex-col gap-2">
              <span class="text-xs font-accent font-semibold text-mts-steel uppercase tracking-wide">Transmission</span>
              <select required [(ngModel)]="form.transmission" name="transmission" class="border border-mts-surface bg-mts-surface rounded-xl px-4 py-2.5 text-sm outline-none focus:border-mts-blue">
                <option value="AUTOMATIC">Automatic</option>
                <option value="MANUAL">Manual</option>
              </select>
            </label>

            <label class="flex flex-col gap-2">
              <span class="text-xs font-accent font-semibold text-mts-steel uppercase tracking-wide">Fuel</span>
              <select required [(ngModel)]="form.fuel" name="fuel" class="border border-mts-surface bg-mts-surface rounded-xl px-4 py-2.5 text-sm outline-none focus:border-mts-blue">
                <option value="PETROL">Petrol</option>
                <option value="DIESEL">Diesel</option>
                <option value="HYBRID">Hybrid</option>
                <option value="ELECTRIC">Electric</option>
              </select>
            </label>
            <label class="flex flex-col gap-2">
              <span class="text-xs font-accent font-semibold text-mts-steel uppercase tracking-wide">Daily Price (&euro;)</span>
              <input type="number" required min="0" step="0.01" [(ngModel)]="form.dailyPrice" name="dailyPrice" class="border border-mts-surface bg-mts-surface rounded-xl px-4 py-2.5 text-sm outline-none focus:border-mts-blue" />
            </label>

            <label class="flex flex-col gap-2">
              <span class="text-xs font-accent font-semibold text-mts-steel uppercase tracking-wide">VIN</span>
              <input type="text" required [(ngModel)]="form.vin" name="vin" class="border border-mts-surface bg-mts-surface rounded-xl px-4 py-2.5 text-sm outline-none focus:border-mts-blue" />
            </label>
            <label class="flex flex-col gap-2">
              <span class="text-xs font-accent font-semibold text-mts-steel uppercase tracking-wide">Registration Number</span>
              <input type="text" required [(ngModel)]="form.registrationNumber" name="registrationNumber" class="border border-mts-surface bg-mts-surface rounded-xl px-4 py-2.5 text-sm outline-none focus:border-mts-blue" />
            </label>

            @if (formError) {
              <p class="sm:col-span-2 text-sm text-red-600">{{ formError }}</p>
            }

            <div class="sm:col-span-2 flex gap-3 mt-2">
              <button type="button" (click)="closeModal()" class="flex-1 py-3 rounded-full border border-mts-surface text-mts-black font-accent font-semibold text-sm hover:bg-mts-surface transition-colors">Cancel</button>
              <button type="submit" [disabled]="saving" class="flex-1 btn-primary disabled:opacity-50">
                {{ saving ? 'Saving...' : (editingId ? 'Save Changes' : 'Create Vehicle') }}
              </button>
            </div>
          </form>
        </div>
      </div>
    }

    <!-- Delete confirmation -->
    @if (deleteTarget) {
      <div class="fixed inset-0 bg-mts-black/50 z-50 flex items-center justify-center p-6" (click)="deleteTarget = null">
        <div class="bg-white rounded-card shadow-premium w-full max-w-sm p-7 text-center" (click)="$event.stopPropagation()">
          <h2 class="font-display font-semibold text-lg text-mts-black mb-2">Delete this vehicle?</h2>
          <p class="text-sm text-mts-steel mb-6">
            {{ deleteTarget.brand }} {{ deleteTarget.model }} will be permanently removed. This can't be undone.
          </p>
          <div class="flex gap-3">
            <button type="button" (click)="deleteTarget = null" class="flex-1 py-3 rounded-full border border-mts-surface text-mts-black font-accent font-semibold text-sm hover:bg-mts-surface transition-colors">Cancel</button>
            <button type="button" (click)="deleteVehicle()" class="flex-1 py-3 rounded-full bg-red-600 text-white font-accent font-semibold text-sm hover:bg-red-700 transition-colors">Delete</button>
          </div>
        </div>
      </div>
    }
  `,
})
export class AdminVehiclesComponent implements OnInit {
  vehicles: Vehicle[] = [];
  loading = true;
  error = false;

  modalOpen = false;
  editingId: string | null = null;
  form: FormState = { ...EMPTY_FORM };
  formError = '';
  saving = false;

  deleteTarget: Vehicle | null = null;

  constructor(private vehicleService: VehicleService) {}

  ngOnInit(): void {
    this.loadVehicles();
  }

  loadVehicles(): void {
    this.loading = true;
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

  openCreate(): void {
    this.editingId = null;
    this.form = { ...EMPTY_FORM };
    this.formError = '';
    this.modalOpen = true;
  }

  openEdit(v: Vehicle): void {
    this.editingId = v.id;
    this.form = {
      brand: v.brand,
      model: v.model,
      year: v.year,
      category: v.category,
      transmission: v.transmission,
      fuel: v.fuel,
      seats: v.seats,
      vin: v.vin,
      registrationNumber: v.registrationNumber,
      dailyPrice: v.dailyPrice,
      agencyId: v.agencyId,
      imageUrl: v.imageUrl,
    };
    this.formError = '';
    this.modalOpen = true;
  }

  closeModal(): void {
    this.modalOpen = false;
  }

  saveVehicle(event: Event): void {
    event.preventDefault();
    this.saving = true;
    this.formError = '';

    const request = this.editingId
      ? this.vehicleService.update(this.editingId, this.form)
      : this.vehicleService.create(this.form);

    request.subscribe({
      next: () => {
        this.saving = false;
        this.modalOpen = false;
        this.loadVehicles();
      },
      error: (err) => {
        this.saving = false;
        this.formError = err?.error?.message || 'Could not save vehicle. Please check the fields.';
      },
    });
  }

  confirmDelete(v: Vehicle): void {
    this.deleteTarget = v;
  }

  deleteVehicle(): void {
    if (!this.deleteTarget) return;
    const id = this.deleteTarget.id;
    this.vehicleService.delete(id).subscribe({
      next: () => {
        this.deleteTarget = null;
        this.loadVehicles();
      },
      error: () => {
        this.deleteTarget = null;
      },
    });
  }

  onPhotosSelected(event: Event, vehicle: Vehicle): void {
    const input = event.target as HTMLInputElement;
    if (!input.files || input.files.length === 0) return;

    const files = Array.from(input.files);
    this.vehicleService.addImages(vehicle.id, files).subscribe({
      next: () => this.loadVehicles(),
      error: () => {},
    });
    input.value = '';
  }
}