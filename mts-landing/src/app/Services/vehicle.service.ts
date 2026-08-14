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

export interface VehiclePayload {
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
  agencyId: string;
  imageUrl: string[];
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

  create(payload: VehiclePayload): Observable<Vehicle> {
    return this.http.post<Vehicle>(this.baseUrl, payload);
  }

  update(id: string, payload: VehiclePayload): Observable<Vehicle> {
    return this.http.put<Vehicle>(`${this.baseUrl}/${id}`, payload);
  }

  delete(id: string): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }

  addImages(id: string, files: File[]): Observable<Vehicle> {
    const formData = new FormData();
    files.forEach((file) => formData.append('files', file));
    return this.http.post<Vehicle>(`${this.baseUrl}/${id}/images`, formData);
  }
}