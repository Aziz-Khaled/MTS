import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'mts-footer',
  standalone: true,
  imports: [RouterLink],
  template: `
    <footer class="bg-mts-dark text-white">
      <div class="max-w-7xl mx-auto px-6 lg:px-10 py-16">
        <div class="grid grid-cols-2 lg:grid-cols-5 gap-10">
          <div class="col-span-2">
            <p class="font-display font-extrabold text-2xl">MTS</p>
            <p class="text-white/50 text-xs tracking-[0.18em] uppercase mt-1 mb-5">Mobility &amp; Transportation Services</p>
            <p class="text-white/50 text-sm max-w-xs leading-relaxed mb-6">
              Premium car rental with a fleet built for reliability, comfort, and effortless booking.
            </p>
            <div class="flex gap-3">
              @for (s of socials; track s.name) {
                <a [href]="s.href" [attr.aria-label]="s.name" class="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center hover:bg-mts-blue transition-colors duration-300">
                  <span [innerHTML]="s.icon"></span>
                </a>
              }
            </div>
          </div>

          <div>
            <p class="font-accent font-semibold text-sm mb-4">Company</p>
            <ul class="flex flex-col gap-3 text-sm text-white/60">
              <li><a routerLink="/" class="hover:text-white transition-colors">About Us</a></li>
              <li><a routerLink="/" class="hover:text-white transition-colors">Careers</a></li>
              <li><a routerLink="/" class="hover:text-white transition-colors">Blog</a></li>
            </ul>
          </div>

          <div>
            <p class="font-accent font-semibold text-sm mb-4">Services</p>
            <ul class="flex flex-col gap-3 text-sm text-white/60">
              <li><a routerLink="/vehicles" class="hover:text-white transition-colors">Car Rental</a></li>
              <li><a routerLink="/vehicles" class="hover:text-white transition-colors">Corporate Rental</a></li>
              <li><a routerLink="/vehicles" class="hover:text-white transition-colors">Long Term Rental</a></li>
            </ul>
          </div>

          <div>
            <p class="font-accent font-semibold text-sm mb-4">Support</p>
            <ul class="flex flex-col gap-3 text-sm text-white/60">
              <li><a routerLink="/contact" class="hover:text-white transition-colors">Contact</a></li>
              <li><a routerLink="/" class="hover:text-white transition-colors">FAQ</a></li>
              <li><a routerLink="/" class="hover:text-white transition-colors">Help Center</a></li>
            </ul>
          </div>
        </div>

        <div class="border-t border-white/10 mt-12 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p class="text-white/40 text-xs">&copy; {{ year }} MTS \u2014 Mobility &amp; Transportation Services. All rights reserved.</p>
          <div class="flex gap-6 text-xs text-white/40">
            <a routerLink="/" class="hover:text-white transition-colors">Privacy Policy</a>
            <a routerLink="/" class="hover:text-white transition-colors">Terms</a>
          </div>
        </div>
      </div>
    </footer>
  `,
})
export class FooterComponent {
  year = new Date().getFullYear();

  socials = [
    { name: 'Facebook', href: '#', icon: '<svg width="16" height="16" viewBox="0 0 24 24" fill="white"><path d="M13.5 21v-8h2.7l0.4-3.2h-3.1V7.7c0-0.9 0.3-1.6 1.7-1.6h1.6V3.2C15.9 3.1 14.7 3 13.5 3c-2.6 0-4.4 1.6-4.4 4.5v2.3H6.4V13h2.7v8h3.7Z"/></svg>' },
    { name: 'Instagram', href: '#', icon: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="1.6"><rect x="3" y="3" width="18" height="18" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.5" cy="6.5" r="1"/></svg>' },
    { name: 'LinkedIn', href: '#', icon: '<svg width="16" height="16" viewBox="0 0 24 24" fill="white"><rect x="3" y="9" width="4" height="12"/><circle cx="5" cy="4.5" r="2.3"/><path d="M11 9h4v2c0.7-1.4 2.2-2.3 4-2.3 3 0 5 2 5 5.6V21h-4v-6c0-1.7-0.7-2.8-2.2-2.8-1.3 0-2.3 0.9-2.6 2-0.1 0.3-0.2 0.7-0.2 1.1V21h-4Z"/></svg>' },
    { name: 'Twitter', href: '#', icon: '<svg width="16" height="16" viewBox="0 0 24 24" fill="white"><path d="M22 5.9c-0.7 0.3-1.5 0.6-2.3 0.7 0.8-0.5 1.4-1.3 1.7-2.3-0.8 0.5-1.6 0.8-2.6 1a4 4 0 0 0-6.9 3.6C8.9 8.7 6 7 4.1 4.6c-0.3 0.6-0.5 1.3-0.5 2 0 1.4 0.7 2.6 1.8 3.3-0.6 0-1.3-0.2-1.8-0.5v0.1c0 2 1.4 3.6 3.2 4-0.3 0.1-0.7 0.1-1.1 0.1-0.3 0-0.5 0-0.8-0.1 0.5 1.6 2 2.8 3.8 2.8A8 8 0 0 1 2 18.6 11.3 11.3 0 0 0 8.1 20c7.3 0 11.3-6.1 11.3-11.3v-0.5c0.8-0.6 1.4-1.3 2-2.1Z"/></svg>' },
  ];
}
