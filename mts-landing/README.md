# MTS Landing Page

A premium, responsive landing page for MTS (Mobility & Transportation Services), a car rental platform. Built with Angular 18 (standalone components), TypeScript, and Tailwind CSS, matching the MTS brand identity (black / dark navy / premium blue, on a white background).

## Getting started

```bash
npm install
npm start
```

Then open `http://localhost:4200`.

To build for production:

```bash
npm run build
```

Output is generated in `dist/mts-landing`.

## Project structure

```
src/app/
  components/
    navbar/              sticky nav, transparent-over-hero -> white on scroll, mobile menu
    hero/                hero banner + floating search/booking card
    stats/                statistics cards (500+ cars, 10K+ customers, etc.)
    featured-vehicles/    premium vehicle card grid (BMW X5, Tesla Model 3, ...)
    categories/           SUV / Sedan / Luxury / Electric / Sports / Compact
    why-choose/            4 feature cards (booking, vehicles, pricing, support)
    promo-banner/          dark gradient CTA banner
    testimonials/          customer review carousel
    faq/                   accordion FAQ
    newsletter/             email subscription card
    footer/                 dark footer with link columns + socials
  pages/
    landing/               composes all sections above into the homepage
    placeholder.component.ts   temporary stand-in for not-yet-built routes

app.routes.ts routes: `/` (landing), `/login`, `/register`, `/vehicles`,
`/vehicles/:id`, `/booking`, `/contact` — the non-landing routes currently
render the placeholder component and are ready to be swapped for real pages.
```

## Brand tokens (tailwind.config.js)

| Token | Hex | Usage |
|---|---|---|
| `mts-black` | `#0B0F14` | Navbar, headings, footer |
| `mts-navy` | `#0F2747` | Buttons, cards, accents |
| `mts-blue` | `#1E5AA8` | Hover states, links |
| `mts-steel` | `#64748B` | Secondary text |
| `mts-surface` | `#F8FAFC` | Card/section backgrounds |
| `mts-dark` | `#080C12` | Hero overlay, footer, premium banners |

Fonts: Poppins (display/headings), Inter (body), Manrope (accents/labels/buttons) — loaded via Google Fonts in `index.html`.

## Notes

- Vehicle images are stock photos from Unsplash (swap the `image` URLs in
  `featured-vehicles.component.ts` for your real fleet photography).
- The hero search card and newsletter form are wired up client-side only
  (no backend yet) — hook them into your API when ready.
