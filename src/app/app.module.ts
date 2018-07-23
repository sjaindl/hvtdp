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
import { AgmCoreModule } from '@agm/core';
import { GOOGLE_MAPS_API_KEY } from './shared/keys';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RestangularModule, Restangular } from 'ngx-restangular';
import { RestangularConfigFactory } from './shared/restConfig';
import { FeedbackService } from './services/feedback.service';
import { DocumentsComponent } from './documents/documents.component';
import { DeviceDetectorModule } from 'ngx-device-detector';

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
    DocumentsComponent
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
    Ng2CarouselamosModule,
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
    RestangularModule.forRoot(RestangularConfigFactory),
    DeviceDetectorModule.forRoot()
  ],
  providers: [FeedbackService],
  bootstrap: [AppComponent]
})
export class AppModule { }
