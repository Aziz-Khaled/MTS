import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Customer {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  drivingLicenseNumber: string;
  dateOfBirth: string;
  blacklisted: boolean;
}

@Injectable({ providedIn: 'root' })
export class CustomerService {
  private readonly baseUrl = 'http://localhost:8080/api/customers';

  constructor(private http: HttpClient) {}

  getById(id: string): Observable<Customer> {
    return this.http.get<Customer>(`${this.baseUrl}/${id}`);
  }
}