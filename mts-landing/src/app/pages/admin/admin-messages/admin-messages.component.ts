import { Component, OnInit } from '@angular/core';
import { ContactService, ContactMessage } from '../../../Services/contact.service';

@Component({
  selector: 'mts-admin-messages',
  standalone: true,
  template: `
    <div class="mb-8">
      <h1 class="font-display font-bold text-2xl lg:text-3xl text-mts-black mb-1">Messages</h1>
      <p class="text-mts-steel text-sm">Contact form submissions from your website.</p>
    </div>

    @if (loading) {
      <p class="text-mts-steel">Loading messages...</p>
    } @else if (error) {
      <p class="text-red-600">Could not load messages.</p>
    } @else if (messages.length === 0) {
      <p class="text-mts-steel">No messages yet.</p>
    } @else {
      <div class="card-surface border border-mts-surface overflow-hidden">
        <table class="w-full text-sm">
          <thead class="bg-mts-surface text-left">
            <tr>
              <th class="px-5 py-3 font-accent font-semibold text-xs text-mts-steel uppercase tracking-wide"></th>
              <th class="px-5 py-3 font-accent font-semibold text-xs text-mts-steel uppercase tracking-wide">From</th>
              <th class="px-5 py-3 font-accent font-semibold text-xs text-mts-steel uppercase tracking-wide">Subject</th>
              <th class="px-5 py-3 font-accent font-semibold text-xs text-mts-steel uppercase tracking-wide">Received</th>
            </tr>
          </thead>
          <tbody>
            @for (m of messages; track m.id) {
              <tr
                class="border-t border-mts-surface hover:bg-mts-surface/60 cursor-pointer transition-colors"
                (click)="openMessage(m)"
              >
                <td class="px-5 py-4">
                  @if (!m.read) {
                    <span class="w-2 h-2 rounded-full bg-mts-blue inline-block"></span>
                  }
                </td>
                <td class="px-5 py-4">
                  <p class="font-medium text-mts-black" [class.font-bold]="!m.read">{{ m.name }}</p>
                  <p class="text-xs text-mts-steel">{{ m.email }}</p>
                </td>
                <td class="px-5 py-4 text-mts-black" [class.font-semibold]="!m.read">{{ m.subject }}</td>
                <td class="px-5 py-4 text-mts-steel text-xs">{{ formatDate(m.createdAt) }}</td>
              </tr>
            }
          </tbody>
        </table>
      </div>
    }

    <!-- Detail modal -->
    @if (selectedMessage) {
      <div class="fixed inset-0 bg-mts-black/50 z-50 flex items-center justify-center p-6" (click)="closeMessage()">
        <div class="bg-white rounded-card shadow-premium w-full max-w-lg p-8" (click)="$event.stopPropagation()">
          <div class="flex items-start justify-between mb-6">
            <div>
              <h2 class="font-display font-bold text-xl text-mts-black">{{ selectedMessage.subject }}</h2>
              <p class="text-xs text-mts-steel mt-1">{{ formatDate(selectedMessage.createdAt) }}</p>
            </div>
            <button type="button" (click)="closeMessage()" class="text-mts-steel hover:text-mts-black">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="6" y1="6" x2="18" y2="18"/><line x1="6" y1="18" x2="18" y2="6"/></svg>
            </button>
          </div>

          <div class="flex items-center gap-3 mb-6 pb-6 border-b border-mts-surface">
            <span class="w-9 h-9 rounded-full bg-mts-navy text-white flex items-center justify-center text-xs font-semibold flex-shrink-0">
              {{ selectedMessage.name.charAt(0) }}
            </span>
            <div>
              <p class="text-mts-black font-medium text-sm">{{ selectedMessage.name }}</p>
              <a [href]="'mailto:' + selectedMessage.email" class="text-mts-blue text-xs hover:underline">{{ selectedMessage.email }}</a>
            </div>
          </div>

          <p class="text-sm text-mts-black leading-relaxed whitespace-pre-wrap">{{ selectedMessage.message }}</p>

          <div class="mt-8">
            <a
              [href]="'mailto:' + selectedMessage.email + '?subject=Re: ' + selectedMessage.subject"
              class="btn-primary inline-flex"
            >Reply by Email</a>
          </div>
        </div>
      </div>
    }
  `,
})
export class AdminMessagesComponent implements OnInit {
  messages: ContactMessage[] = [];
  loading = true;
  error = false;
  selectedMessage: ContactMessage | null = null;

  constructor(private contactService: ContactService) {}

  ngOnInit(): void {
    this.loadMessages();
  }

  loadMessages(): void {
    this.loading = true;
    this.contactService.getAll().subscribe({
      next: (data) => {
        this.messages = data;
        this.loading = false;
      },
      error: () => {
        this.error = true;
        this.loading = false;
      },
    });
  }

  openMessage(message: ContactMessage): void {
    this.selectedMessage = message;
    if (!message.read) {
      this.contactService.markAsRead(message.id).subscribe({
        next: () => {
          message.read = true;
        },
        error: () => {},
      });
    }
  }

  closeMessage(): void {
    this.selectedMessage = null;
  }

  formatDate(isoDate: string): string {
    return new Date(isoDate).toLocaleString(undefined, {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  }
}