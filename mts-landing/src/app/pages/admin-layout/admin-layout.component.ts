import { Component } from '@angular/core';
import { Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { AuthService } from '../../Services/auth.service';

@Component({
  selector: 'mts-admin-layout',
  standalone: true,
  imports: [RouterLink, RouterLinkActive, RouterOutlet],
  template: `
    <div class="min-h-screen bg-mts-surface flex">
      <!-- Sidebar -->
      <aside class="w-64 bg-mts-black flex-shrink-0 flex flex-col fixed h-screen">
        <div class="px-6 py-7 border-b border-white/10">
          <p class="font-display font-extrabold text-xl text-white">MTS</p>
          <p class="font-accent text-[10px] tracking-[0.18em] uppercase text-white/50 mt-1">Admin Panel</p>
        </div>

        <nav class="flex-1 px-4 py-6 flex flex-col gap-1">
          <a
            routerLink="/admin/overview"
            routerLinkActive="bg-mts-navy text-white"
            class="flex items-center gap-3 px-4 py-3 rounded-xl text-white/70 font-accent font-medium text-sm hover:bg-white/5 transition-colors"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><rect x="3" y="3" width="7" height="9" rx="1"/><rect x="14" y="3" width="7" height="5" rx="1"/><rect x="14" y="12" width="7" height="9" rx="1"/><rect x="3" y="16" width="7" height="5" rx="1"/></svg>
            Overview
          </a>
          <a
            routerLink="/admin/vehicles"
            routerLinkActive="bg-mts-navy text-white"
            class="flex items-center gap-3 px-4 py-3 rounded-xl text-white/70 font-accent font-medium text-sm hover:bg-white/5 transition-colors"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M4 21V9l4-5h6l4 5v12"/><path d="M9 21v-5h6v5"/></svg>
            Vehicles
          </a>
        </nav>

        <div class="px-4 py-6 border-t border-white/10">
          <a routerLink="/" class="flex items-center gap-3 px-4 py-3 rounded-xl text-white/50 font-accent font-medium text-sm hover:bg-white/5 transition-colors mb-1">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M15 18l-6-6 6-6"/></svg>
            Back to Site
          </a>
          <button
            type="button"
            (click)="logout()"
            class="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-red-400 font-accent font-medium text-sm hover:bg-white/5 transition-colors"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><path d="M16 17l5-5-5-5"/><path d="M21 12H9"/></svg>
            Log Out
          </button>
        </div>
      </aside>

      <!-- Content -->
      <main class="flex-1 ml-64 p-8 lg:p-10">
        <router-outlet></router-outlet>
      </main>
    </div>
  `,
})
export class AdminLayoutComponent {
  constructor(private authService: AuthService, private router: Router) {}

  logout(): void {
    this.authService.logout();
    this.router.navigateByUrl('/');
  }
}