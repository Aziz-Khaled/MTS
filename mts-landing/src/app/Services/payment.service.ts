import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface PaymentIntentResponse {
  clientSecret: string;
  depositAmount: number;
}

@Injectable({ providedIn: 'root' })
export class PaymentService {
  private readonly baseUrl = 'http://localhost:8080/api/payments';

  constructor(private http: HttpClient) {}

  createIntent(reservationId: string): Observable<PaymentIntentResponse> {
    return this.http.post<PaymentIntentResponse>(
      `${this.baseUrl}/reservations/${reservationId}/intent`,
      {}
    );
  }
}