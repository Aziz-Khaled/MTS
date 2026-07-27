import { Component, Input } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'mts-placeholder',
  standalone: true,
  imports: [RouterLink],
  template: `
    <div class="min-h-[60vh] flex flex-col items-center justify-center text-center px-6 bg-mts-surface">
      <p class="section-eyebrow mb-3">{{ label }}</p>
      <h1 class="font-display font-semibold text-3xl md:text-4xl text-mts-black mb-3">This page is coming soon</h1>
      <p class="text-mts-steel max-w-md">
        The {{ label }} experience is under construction. Head back to the homepage to keep exploring MTS.
      </p>
      <a routerLink="/" class="btn-primary mt-8">Back to Home</a>
    </div>
  `,
})
export class PlaceholderComponent {
  @Input() label = 'Page';
}
