import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NavbarComponent } from '../../components/navbar/navbar.component';
import { FooterComponent } from '../../components/footer/footer.component';

@Component({
  selector: 'mts-contact',
  standalone: true,
  imports: [FormsModule, NavbarComponent, FooterComponent],
  template: `
    <mts-navbar [alwaysSolid]="true" [showBookButton]="false"></mts-navbar>

    <main class="bg-white min-h-screen">
      <section class="bg-mts-gradient pt-40 pb-20">
        <div class="max-w-4xl mx-auto px-6 lg:px-10 text-center">
          <p class="section-eyebrow text-white/70 mb-3">Get In Touch</p>
          <h1 class="font-display font-bold text-3xl lg:text-5xl text-white mb-5">Contact Us</h1>
          <p class="text-white/70 text-lg max-w-2xl mx-auto">
            Questions about a booking, a corporate plan, or just need help choosing a car?
            Our team is here for you.
          </p>
        </div>
      </section>

      <section class="max-w-7xl mx-auto px-6 lg:px-10 py-20 lg:py-24">
        <div class="grid grid-cols-1 lg:grid-cols-3 gap-7 mb-16">
          <div class="card-surface border border-mts-surface p-7 text-center">
            <div class="w-14 h-14 mx-auto rounded-2xl bg-mts-navy/10 flex items-center justify-center text-mts-navy mb-5">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7"><path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3 19.5 19.5 0 0 1-6-6 19.8 19.8 0 0 1-3-8.7A2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1.9.4 1.9.7 2.7a2 2 0 0 1-.4 2.1L8 9.9a16 16 0 0 0 6 6l1.4-1.4a2 2 0 0 1 2.1-.4c.9.3 1.8.6 2.7.7a2 2 0 0 1 1.8 2Z"/></svg>
            </div>
            <h3 class="font-display font-semibold text-lg text-mts-black mb-1">Call Us</h3>
            <p class="text-mts-steel text-sm mb-1">Mon &ndash; Sat, 8am &ndash; 8pm</p>
            <a href="tel:+21671000000" class="text-mts-blue font-accent font-semibold text-sm hover:underline">+216 71 000 000</a>
          </div>

          <div class="card-surface border border-mts-surface p-7 text-center">
            <div class="w-14 h-14 mx-auto rounded-2xl bg-mts-navy/10 flex items-center justify-center text-mts-navy mb-5">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7"><rect x="3" y="5" width="18" height="14" rx="2"/><path d="M3 7l9 6 9-6"/></svg>
            </div>
            <h3 class="font-display font-semibold text-lg text-mts-black mb-1">Email Us</h3>
            <p class="text-mts-steel text-sm mb-1">We reply within 24 hours</p>
            <a href="mailto:support@mts-rental.com" class="text-mts-blue font-accent font-semibold text-sm hover:underline">support&#64;mts-rental.com</a>
          </div>

          <div class="card-surface border border-mts-surface p-7 text-center">
            <div class="w-14 h-14 mx-auto rounded-2xl bg-mts-navy/10 flex items-center justify-center text-mts-navy mb-5">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7"><path d="M12 22s7-6.5 7-12a7 7 0 1 0-14 0c0 5.5 7 12 7 12Z"/><circle cx="12" cy="10" r="2.5"/></svg>
            </div>
            <h3 class="font-display font-semibold text-lg text-mts-black mb-1">Visit Us</h3>
            <p class="text-mts-steel text-sm mb-1">Main branch</p>
            <p class="text-mts-blue font-accent font-semibold text-sm">Tunis, Tunisia</p>
          </div>
        </div>

        <div class="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
          <!-- Form -->
          <div class="card-surface border border-mts-surface shadow-soft p-8">
            <h2 class="font-display font-bold text-2xl text-mts-black mb-2">Send Us a Message</h2>
            <p class="text-mts-steel text-sm mb-8">Fill out the form and we'll get back to you shortly.</p>

            @if (submitted) {
              <div class="rounded-xl bg-mts-surface p-6 text-center">
                <p class="font-accent font-semibold text-mts-black mb-1">Message sent!</p>
                <p class="text-sm text-mts-steel">Thanks for reaching out — our team will respond within 24 hours.</p>
              </div>
            } @else {
              <form (submit)="submit($event)" class="flex flex-col gap-5">
                <div class="grid grid-cols-2 gap-4">
                  <label class="flex flex-col gap-2">
                    <span class="text-xs font-accent font-semibold text-mts-steel uppercase tracking-wide">Name</span>
                    <input type="text" required [(ngModel)]="name" name="name" class="border border-mts-surface bg-mts-surface rounded-xl px-4 py-3 text-sm outline-none focus:border-mts-blue transition-colors" />
                  </label>
                  <label class="flex flex-col gap-2">
                    <span class="text-xs font-accent font-semibold text-mts-steel uppercase tracking-wide">Email</span>
                    <input type="email" required [(ngModel)]="email" name="email" class="border border-mts-surface bg-mts-surface rounded-xl px-4 py-3 text-sm outline-none focus:border-mts-blue transition-colors" />
                  </label>
                </div>

                <label class="flex flex-col gap-2">
                  <span class="text-xs font-accent font-semibold text-mts-steel uppercase tracking-wide">Subject</span>
                  <select required [(ngModel)]="subject" name="subject" class="border border-mts-surface bg-mts-surface rounded-xl px-4 py-3 text-sm outline-none focus:border-mts-blue transition-colors">
                    <option value="" disabled selected>Select a topic</option>
                    <option value="booking">Booking Question</option>
                    <option value="corporate">Corporate Rental</option>
                    <option value="support">Support / Issue</option>
                    <option value="other">Other</option>
                  </select>
                </label>

                <label class="flex flex-col gap-2">
                  <span class="text-xs font-accent font-semibold text-mts-steel uppercase tracking-wide">Message</span>
                  <textarea required [(ngModel)]="message" name="message" rows="5" class="border border-mts-surface bg-mts-surface rounded-xl px-4 py-3 text-sm outline-none focus:border-mts-blue transition-colors resize-none"></textarea>
                </label>

                <button type="submit" class="btn-primary w-full mt-2">Send Message</button>
              </form>
            }
          </div>

          <!-- Map placeholder + hours -->
          <div class="flex flex-col gap-6">
            <div class="rounded-card overflow-hidden shadow-soft h-64 bg-mts-surface flex items-center justify-center">
              <p class="text-mts-steel text-sm">Map coming soon</p>
            </div>

            <div class="card-surface border border-mts-surface p-7">
              <h3 class="font-accent font-semibold text-sm text-mts-black mb-4 uppercase tracking-wide">Business Hours</h3>
              <dl class="flex flex-col gap-3 text-sm">
                <div class="flex justify-between">
                  <dt class="text-mts-steel">Monday &ndash; Friday</dt>
                  <dd class="text-mts-black font-medium">8:00 AM &ndash; 8:00 PM</dd>
                </div>
                <div class="flex justify-between">
                  <dt class="text-mts-steel">Saturday</dt>
                  <dd class="text-mts-black font-medium">9:00 AM &ndash; 6:00 PM</dd>
                </div>
                <div class="flex justify-between">
                  <dt class="text-mts-steel">Sunday</dt>
                  <dd class="text-mts-black font-medium">Closed</dd>
                </div>
              </dl>
            </div>
          </div>
        </div>
      </section>
    </main>

    <mts-footer></mts-footer>
  `,
})
export class ContactComponent {
  name = '';
  email = '';
  subject = '';
  message = '';
  submitted = false;

  submit(event: Event): void {
    event.preventDefault();
    // TODO: wire to a real backend endpoint (e.g. POST /api/contact) once built.
    // For now this just confirms submission client-side.
    this.submitted = true;
  }
}