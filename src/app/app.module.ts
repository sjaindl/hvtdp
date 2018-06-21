import { AppRoutingModule } from './app-routing/app-routing.module';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FlexLayoutModule } from '@angular/flex-layout'

import { MatToolbarModule, MatListModule, MatDividerModule, MatSidenavModule, MatIconModule } from '@angular/material';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { HomeComponent } from './home/home.component';
import { HeaderComponent } from './header/header.component';
import { FooterComponent } from './footer/footer.component';

import 'hammerjs';
import { TeamComponent } from './team/team.component';
import { Ng2CarouselamosModule } from 'ng2-carouselamos';
import { NewsComponent } from './news/news.component';
import { ChampionshipComponent } from './championship/championship.component';
import { GalleryComponent } from './gallery/gallery.component';
import { SocialmediaComponent } from './socialmedia/socialmedia.component';
import { DonationsComponent } from './donations/donations.component';
import { AboutComponent } from './about/about.component';
import { ContactComponent } from './contact/contact.component';
import { FanshopComponent } from './fanshop/fanshop.component';
import { MembershipComponent } from './membership/membership.component';
import { HalloffameComponent } from './halloffame/halloffame.component';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    HeaderComponent,
    FooterComponent,
    TeamComponent,
    NewsComponent,
    ChampionshipComponent,
    GalleryComponent,
    SocialmediaComponent,
    DonationsComponent,
    AboutComponent,
    ContactComponent,
    FanshopComponent,
    MembershipComponent,
    HalloffameComponent
  ],
  imports: [
    BrowserModule ,
    BrowserAnimationsModule,
    MatListModule,
    MatDividerModule,
    MatToolbarModule,
    FlexLayoutModule, 
    AppRoutingModule,
    Ng2CarouselamosModule,
    MatSidenavModule,
    MatIconModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
