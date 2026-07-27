import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Vehicle {
  id: string;
  brand: string;
  model: string;
  year: number;
  category: string;
  transmission: string;
  fuel: string;
  seats: number;
  vin: string;
  registrationNumber: string;
  dailyPrice: number;
  status: string;
  agencyId: string;
  imageUrl: string[];
  bookable: boolean;
}

@Injectable({ providedIn: 'root' })
export class VehicleService {
  private readonly baseUrl = 'http://localhost:8080/api/vehicles';

  constructor(private http: HttpClient) {}

  getAll(availableOnly = false): Observable<Vehicle[]> {
    return this.http.get<Vehicle[]>(`${this.baseUrl}?availableOnly=${availableOnly}`);
  }

  getById(id: string): Observable<Vehicle> {
    return this.http.get<Vehicle>(`${this.baseUrl}/${id}`);
  }
}