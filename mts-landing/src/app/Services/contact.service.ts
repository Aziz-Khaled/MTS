import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface ContactMessage {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  createdAt: string;
  read: boolean;
}

export interface ContactMessageRequest {
  name: string;
  email: string;
  subject: string;
  message: string;
}

@Injectable({ providedIn: 'root' })
export class ContactService {
  private readonly baseUrl = 'http://localhost:8080/api/contact';

  constructor(private http: HttpClient) {}

  send(payload: ContactMessageRequest): Observable<ContactMessage> {
    return this.http.post<ContactMessage>(this.baseUrl, payload);
  }

  getAll(): Observable<ContactMessage[]> {
    return this.http.get<ContactMessage[]>(this.baseUrl);
  }

  markAsRead(id: string): Observable<ContactMessage> {
    return this.http.put<ContactMessage>(`${this.baseUrl}/${id}/read`, {});
  }
}