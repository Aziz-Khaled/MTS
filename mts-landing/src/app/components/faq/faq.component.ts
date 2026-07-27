import { Component } from '@angular/core';

interface FaqItem {
  question: string;
  answer: string;
  open: boolean;
}

@Component({
  selector: 'mts-faq',
  standalone: true,
  template: `
    <section class="bg-mts-surface">
      <div class="max-w-3xl mx-auto px-6 lg:px-10 py-20 lg:py-24">
        <div class="text-center mb-12">
          <p class="section-eyebrow mb-3">FAQ</p>
          <h2 class="font-display font-bold text-3xl lg:text-4xl text-mts-black">Frequently Asked Questions</h2>
        </div>

        <div class="flex flex-col gap-3">
          @for (item of items; track item.question; let i = $index) {
            <div class="bg-white rounded-2xl border border-mts-surface overflow-hidden">
              <button
                type="button"
                (click)="toggle(i)"
                class="w-full flex items-center justify-between gap-4 px-6 py-5 text-left"
                [attr.aria-expanded]="item.open"
              >
                <span class="font-accent font-semibold text-mts-black">{{ item.question }}</span>
                <svg
                  width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#0F2747" stroke-width="2"
                  class="transition-transform duration-300 flex-shrink-0"
                  [class.rotate-45]="item.open"
                >
                  <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
                </svg>
              </button>
              @if (item.open) {
                <div class="px-6 pb-5 text-mts-steel text-sm leading-relaxed">{{ item.answer }}</div>
              }
            </div>
          }
        </div>
      </div>
    </section>
  `,
})
export class FaqComponent {
  items: FaqItem[] = [
    { question: 'How can I rent a car?', answer: 'Search for a vehicle on our Vehicles page, choose your pickup and return dates, then complete the booking form to confirm your reservation.', open: true },
    { question: 'What documents are required?', answer: 'You will need a valid driving license, a government-issued ID or passport, and a credit card in the driver\u2019s name.', open: false },
    { question: 'Can I cancel my reservation?', answer: 'Yes, reservations can be cancelled free of charge up to 48 hours before pickup through your account or by contacting support.', open: false },
    { question: 'Do you provide insurance?', answer: 'Every rental includes standard coverage, with optional premium insurance plans available at checkout for extra peace of mind.', open: false },
  ];

  toggle(index: number): void {
    this.items[index].open = !this.items[index].open;
  }
}
