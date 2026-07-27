import { Component } from '@angular/core';

interface Testimonial {
  name: string;
  location: string;
  rating: number;
  review: string;
  avatar: string;
}

@Component({
  selector: 'mts-testimonials',
  standalone: true,
  template: `
    <section class="bg-white">
      <div class="max-w-7xl mx-auto px-6 lg:px-10 py-20 lg:py-24">
        <div class="text-center max-w-2xl mx-auto mb-12">
          <p class="section-eyebrow mb-3">Testimonials</p>
          <h2 class="font-display font-bold text-3xl lg:text-4xl text-mts-black">What Our Customers Say</h2>
        </div>

        <div class="relative">
          <div class="overflow-hidden">
            <div
              class="flex transition-transform duration-500 ease-out"
              [style.transform]="'translateX(-' + (active * 100) + '%)'"
            >
              @for (t of testimonials; track t.name) {
                <div class="w-full flex-shrink-0 px-2">
                  <div class="card-surface border border-mts-surface p-8 lg:p-12 max-w-3xl mx-auto text-center">
                    <div class="flex justify-center gap-1 text-amber-500 mb-5">
                      @for (s of [1,2,3,4,5]; track s) {
                        <svg width="16" height="16" viewBox="0 0 24 24" [attr.fill]="s <= t.rating ? '#f59e0b' : 'none'" stroke="#f59e0b" stroke-width="1.5"><path d="M12 2l3 6.5 7 1-5.2 5 1.3 7L12 18l-6.1 3.5 1.3-7L2 9.5l7-1L12 2Z"/></svg>
                      }
                    </div>
                    <p class="font-body text-mts-black text-lg leading-relaxed mb-7">&ldquo;{{ t.review }}&rdquo;</p>
                    <div class="flex items-center justify-center gap-3">
                      <img [src]="t.avatar" [alt]="t.name" class="w-12 h-12 rounded-full object-cover" />
                      <div class="text-left">
                        <p class="font-accent font-semibold text-mts-black text-sm">{{ t.name }}</p>
                        <p class="text-mts-steel text-xs">{{ t.location }}</p>
                      </div>
                    </div>
                  </div>
                </div>
              }
            </div>
          </div>

          <div class="flex justify-center gap-2 mt-8">
            @for (t of testimonials; track t.name; let i = $index) {
              <button
                type="button"
                (click)="active = i"
                class="w-2.5 h-2.5 rounded-full transition-colors duration-300"
                [class.bg-mts-navy]="active === i"
                [class.bg-mts-surface]="active !== i"
                [attr.aria-label]="'Show testimonial ' + (i + 1)"
              ></button>
            }
          </div>
        </div>
      </div>
    </section>
  `,
})
export class TestimonialsComponent {
  active = 0;

  testimonials: Testimonial[] = [
    { name: 'Sarah Mitchell', location: 'Madrid, Spain', rating: 5, review: 'MTS made renting a premium sedan effortless. The car was spotless and the pickup took minutes.', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=200&auto=format&fit=crop' },
    { name: 'David Chen', location: 'Lisbon, Portugal', rating: 5, review: 'Booked an SUV for a family trip. Transparent pricing and the support team was available whenever I needed help.', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=200&auto=format&fit=crop' },
    { name: 'Amira Haddad', location: 'Tunis, Tunisia', rating: 4, review: 'Great selection of luxury vehicles and a smooth booking flow from start to finish.', avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=200&auto=format&fit=crop' },
  ];
}
