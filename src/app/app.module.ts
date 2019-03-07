import { AppRoutingModule } from './app-routing/app-routing.module';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FlexLayoutModule } from '@angular/flex-layout'
import { MatToolbarModule, MatListModule, MatDividerModule, MatSidenavModule, MatIconModule, MatGridListModule, MatInputModule, MatFormFieldModule, MatSlideToggleModule, MatSelectModule, MatOptionModule, MatCheckboxModule, MatExpansionModule, MatPaginatorModule } from '@angular/material';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { HomeComponent } from './home/home.component';
import { HeaderComponent } from './header/header.component';
import { FooterComponent } from './footer/footer.component';

import 'hammerjs';
import { TeamComponent } from './team/team.component';
import { NguCarouselModule } from '@ngu/carousel'
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
import { AgmCoreModule } from '@agm/core';
import { GOOGLE_MAPS_API_KEY } from './shared/keys';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DocumentsComponent } from './documents/documents.component';
import { DeviceDetectorModule } from 'ngx-device-detector';
import { SurveysComponent } from './surveys/surveys.component';
import { MysqlService } from './services/mysql.service';

import { LocationStrategy, HashLocationStrategy } from '@angular/common'
import { CookieLawModule } from 'angular2-cookie-law'
import { HttpClientModule } from '@angular/common/http';
import { StatisticsService } from './services/statistics.service';
import { StartingelevenComponent } from './startingeleven/startingeleven.component';

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
    HalloffameComponent,
    DocumentsComponent,
    SurveysComponent,
    StartingelevenComponent
  ],
  imports: [
    BrowserModule ,
    BrowserAnimationsModule,
    MatListModule,
    MatCheckboxModule,
    MatDividerModule,
    MatToolbarModule,
    MatInputModule,
    MatFormFieldModule,
    MatSlideToggleModule,
    MatSelectModule,
    MatOptionModule,
    FlexLayoutModule, 
    AppRoutingModule,
    NguCarouselModule,
    MatSidenavModule,
    MatIconModule,
    MatGridListModule,
    MatExpansionModule,
    MatPaginatorModule,
    AgmCoreModule.forRoot({
      apiKey: GOOGLE_MAPS_API_KEY
    }),
    FormsModule,
    ReactiveFormsModule,
    DeviceDetectorModule.forRoot(),
    HttpClientModule,
    CookieLawModule
  ],
  providers: [MysqlService, StatisticsService, {provide: LocationStrategy, useClass: HashLocationStrategy}],
  bootstrap: [AppComponent]
})
export class AppModule { }
