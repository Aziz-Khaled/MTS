import { Component, HostListener, Input } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'mts-navbar',
  standalone: true,
  imports: [RouterLink],
  template: `
    <nav
      class="fixed top-0 left-0 right-0 z-50 transition-all duration-300"
      [class.bg-white]="isSolid"
      [class.shadow-soft]="isSolid"
      [class.bg-transparent]="!isSolid"
    >
      <div class="max-w-7xl mx-auto px-6 lg:px-10">
        <div class="flex items-center justify-between h-20">
          <a routerLink="/" class="flex flex-col leading-none">
            <span
              class="font-display font-extrabold text-2xl tracking-tight transition-colors duration-300"
              [class.text-mts-black]="isSolid"
              [class.text-white]="!isSolid"
            >MTS</span>
            <span
              class="font-accent text-[10px] tracking-[0.18em] uppercase transition-colors duration-300"
              [class.text-mts-steel]="isSolid"
              [class.text-white]="!isSolid"
              [class.opacity-70]="!isSolid"
            >Mobility &amp; Transportation Services</span>
          </a>

          <div class="hidden lg:flex items-center gap-9 font-accent font-medium text-sm">
            @for (link of navLinks; track link.route) {
              <a
                [routerLink]="link.route"
                class="transition-colors duration-300 hover:text-mts-blue"
                [class.text-mts-black]="isSolid"
                [class.text-white]="!isSolid"
              >{{ link.label }}</a>
            }
          </div>

          <div class="hidden lg:flex items-center gap-3">
            <a
              routerLink="/login"
              class="font-accent font-medium text-sm px-4 py-2 transition-colors duration-300 hover:text-mts-blue"
              [class.text-mts-black]="isSolid"
              [class.text-white]="!isSolid"
            >Login</a>
            <a
              routerLink="/register"
              class="font-accent font-medium text-sm px-4 py-2 rounded-full border transition-colors duration-300"
              [class.text-mts-black]="isSolid"
              [class.border-mts-black]="isSolid"
              [class.text-white]="!isSolid"
              [class.border-white]="!isSolid"
            >Register</a>
            @if (showBookButton) {
              <a routerLink="/booking" class="btn-primary !px-6 !py-3 text-sm">Book a Car</a>
            }
          </div>

          <button
            type="button"
            class="lg:hidden w-10 h-10 flex items-center justify-center rounded-full transition-colors"
            [class.text-mts-black]="isSolid"
            [class.text-white]="!isSolid"
            (click)="mobileOpen = !mobileOpen"
            aria-label="Toggle menu"
          >
            @if (!mobileOpen) {
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/></svg>
            } @else {
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><line x1="6" y1="6" x2="18" y2="18"/><line x1="6" y1="18" x2="18" y2="6"/></svg>
            }
          </button>
        </div>
      </div>

      @if (mobileOpen) {
        <div class="lg:hidden bg-white shadow-premium px-6 pb-6 pt-2">
          <div class="flex flex-col gap-1">
            @for (link of navLinks; track link.route) {
              <a
                [routerLink]="link.route"
                (click)="mobileOpen = false"
                class="py-3 font-accent font-medium text-mts-black border-b border-mts-surface"
              >{{ link.label }}</a>
            }
          </div>
          <div class="flex flex-col gap-3 mt-5">
            <a routerLink="/login" (click)="mobileOpen = false" class="text-center py-3 font-accent font-medium text-mts-black border border-mts-black rounded-full">Login</a>
            <a routerLink="/register" (click)="mobileOpen = false" class="text-center py-3 font-accent font-medium text-mts-black border border-mts-black rounded-full">Register</a>
            @if (showBookButton) {
              <a routerLink="/booking" (click)="mobileOpen = false" class="btn-primary text-center">Book a Car</a>
            }
          </div>
        </div>
      }
    </nav>
  `,
})
export class NavbarComponent {
  @Input() alwaysSolid = false;
  @Input() showBookButton = true;
  scrolled = false;
  mobileOpen = false;

  get isSolid(): boolean {
    return this.alwaysSolid || this.scrolled;
  }

  navLinks = [
    { label: 'Home', route: '/' },
    { label: 'Vehicles', route: '/vehicles' },
    { label: 'Categories', route: '/vehicles', fragment: 'categories' },
    { label: 'About', route: '/', fragment: 'why-choose' },
    { label: 'Services', route: '/', fragment: 'why-choose' },
    { label: 'Contact', route: '/contact' },
  ];

  @HostListener('window:scroll')
  onScroll(): void {
    this.scrolled = window.scrollY > 40;
  }
}