import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Reservation {
  id: string;
  vehicleId: string;
  customerId: string;
  pickupAgencyId: string;
  returnAgencyId: string;
  pickupDate: string;
  returnDate: string;
  totalPrice: number;
  status: 'PENDING' | 'CONFIRMED' | 'IN_PREPARATION' | 'ACTIVE' | 'COMPLETED' | 'CANCELLED';
}

export interface ReservationRequest {
  vehicleId: string;
  pickupAgencyId: string;
  returnAgencyId: string;
  pickupDate: string; // yyyy-MM-dd
  returnDate: string; // yyyy-MM-dd
}

@Injectable({ providedIn: 'root' })
export class ReservationService {
  private readonly baseUrl = 'http://localhost:8080/api/reservations';

  constructor(private http: HttpClient) {}

  create(payload: ReservationRequest): Observable<Reservation> {
    return this.http.post<Reservation>(this.baseUrl, payload);
  }

  getMine(): Observable<Reservation[]> {
    return this.http.get<Reservation[]>(`${this.baseUrl}/me`);
  }

  getAll(): Observable<Reservation[]> {
    return this.http.get<Reservation[]>(this.baseUrl);
  }

  getById(id: string): Observable<Reservation> {
    return this.http.get<Reservation>(`${this.baseUrl}/${id}`);
  }

  cancel(id: string): Observable<Reservation> {
    return this.http.put<Reservation>(`${this.baseUrl}/${id}/cancel`, {});
  }
}