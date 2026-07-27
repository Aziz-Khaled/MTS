import { Component } from '@angular/core';
import { NavbarComponent } from '../../components/navbar/navbar.component';
import { HeroComponent } from '../../components/hero/hero.component';
import { StatsComponent } from '../../components/stats/stats.component';
import { FeaturedVehiclesComponent } from '../../components/featured-vehicles/featured-vehicles.component';
import { CategoriesComponent } from '../../components/categories/categories.component';
import { WhyChooseComponent } from '../../components/why-choose/why-choose.component';
import { PromoBannerComponent } from '../../components/promo-banner/promo-banner.component';
import { TestimonialsComponent } from '../../components/testimonials/testimonials.component';
import { FaqComponent } from '../../components/faq/faq.component';
import { NewsletterComponent } from '../../components/newsletter/newsletter.component';
import { FooterComponent } from '../../components/footer/footer.component';

@Component({
  selector: 'mts-landing',
  standalone: true,
  imports: [
    NavbarComponent,
    HeroComponent,
    StatsComponent,
    FeaturedVehiclesComponent,
    CategoriesComponent,
    WhyChooseComponent,
    PromoBannerComponent,
    TestimonialsComponent,
    FaqComponent,
    NewsletterComponent,
    FooterComponent,
  ],
  template: `
    <mts-navbar></mts-navbar>
    <main>
      <mts-hero></mts-hero>
      <mts-stats></mts-stats>
      <mts-featured-vehicles></mts-featured-vehicles>
      <mts-categories></mts-categories>
      <mts-why-choose></mts-why-choose>
      <mts-promo-banner></mts-promo-banner>
      <mts-testimonials></mts-testimonials>
      <mts-faq></mts-faq>
      <mts-newsletter></mts-newsletter>
    </main>
    <mts-footer></mts-footer>
  `,
})
export class LandingComponent {}
