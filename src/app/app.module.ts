import { AppRoutingModule } from './app-routing/app-routing.module';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatIconModule } from '@angular/material/icon';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatListModule } from '@angular/material/list';
import { MatDialogModule } from '@angular/material/dialog';
import { MatDividerModule } from '@angular/material/divider';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatSelectModule } from '@angular/material/select';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatTableModule } from '@angular/material/table';
import { MatSortModule } from '@angular/material/sort';
import { MatSnackBarModule, MAT_SNACK_BAR_DEFAULT_OPTIONS } from '@angular/material/snack-bar';
import { MatMenuModule } from '@angular/material/menu';
import { MatButtonModule } from '@angular/material/button';

import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { LocationStrategy, HashLocationStrategy } from '@angular/common';
import { provideHttpClient, withInterceptorsFromDi, withJsonpSupport } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { GoogleMapsModule } from '@angular/google-maps';
import { NgcCookieConsentConfig } from 'ngx-cookieconsent';
import { CookieService } from 'ngx-cookie-service';

import { AppComponent } from './app.component';
import { RedirectGuard } from './app-routing/redirect-guard';
import { MysqlService } from './services/mysql.service';
import { StatisticsService } from './services/statistics.service';

import { HeaderComponent } from './header/header.component';
import { FooterComponent } from './footer/footer.component';
import { AboutComponent } from './about/about.component';
import { AdventComponent } from './advent/advent.component';
import { ComedyhirtenComponent } from './comedyhirten/comedyhirten.component';
import { DocumentsComponent } from './documents/documents.component';
import { DonationsComponent } from './donations/donations.component';
import { GalleryComponent } from './gallery/gallery.component';
import { GoalOfTheSeasonComponent } from './goaloftheseason/goaloftheseason.component';
import { GoldenshotVotingComponent } from './goldenshot-voting/goldenshot-voting.component';
import { HalloffameComponent } from './halloffame/halloffame.component';
import { MembershipComponent } from './membership/membership.component';
import { PlayerOfTheSeasonComponent } from './playeroftheseason/playeroftheseason.component';
import { SafePipe } from './pipes/SafePipe';
import { SocialmediaComponent } from './socialmedia/socialmedia.component';
import { StadionFestComponent } from './stadionfest/stadionfest.component';
import { StartingelevenComponent } from './startingeleven/startingeleven.component';
import { SurveysComponent } from './surveys/surveys.component';
import { TeamComponent } from './team/team.component';
import { ZehnjahresfeierComponent } from './zehnjahresfeier/zehnjahresfeier.component';
import { HomeComponent } from './home/home.component';
import { NewsComponent } from './news/news.component';
import { ChampionshipComponent } from './championship/championship.component';
import { KleinfeldTurnierComponent } from './kleinfeldturnier/kleinfeldturnier.component';
import { DuckrunComponent } from './duckrun/duckrun.component';
import { GoldenshotComponent } from './goldenshot/goldenshot.component';
import { PassworddialogComponent } from './passworddialog/passworddialog.component';
import { TickerComponent } from './ticker/ticker.component';
import { ImagesliderComponent } from './imageslider/imageslider.component';
import { HvtdpImageComponent } from './hvtdp-image/hvtdp-image.component';
import { BigdartsComponent } from './bigdarts/bigdarts.component';
import { ContactComponent } from './contact/contact.component';
import { BocciaComponent } from './boccia/boccia.component';
import { FanshopComponent } from './fanshop/fanshop.component';
import { HallenturnierComponent } from './hallenturnier/hallenturnier.component';
import { HallofpappComponent } from './hallofpapp/hallofpapp.component';

const cookieConfig: NgcCookieConsentConfig = {
  cookie: {
    domain: 'hvtdpstainz.at',
  },
  palette: {
    popup: {
      background: '#c2185b',
    },
    button: {
      background: '#f1d600',
    },
  },
  theme: 'edgeless',
    type: 'opt-out',
};

@NgModule({
  declarations: [
    AboutComponent,
    AdventComponent,
    ComedyhirtenComponent,
    DocumentsComponent,
    DonationsComponent,
    GalleryComponent,
    GoalOfTheSeasonComponent,
    GoldenshotVotingComponent,
    HalloffameComponent,
    MembershipComponent,
    PlayerOfTheSeasonComponent,
    SafePipe,
    SocialmediaComponent,
    StadionFestComponent,
    StartingelevenComponent,
    SurveysComponent,
    TeamComponent,
    ZehnjahresfeierComponent,
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    AppComponent,
    FormsModule,
    ReactiveFormsModule,
    GoogleMapsModule,
    HeaderComponent,
    FooterComponent,
    MatListModule,
    MatCheckboxModule,
    MatDialogModule,
    MatDividerModule,
    MatToolbarModule,
    MatInputModule,
    MatFormFieldModule,
    MatSlideToggleModule,
    MatSelectModule,
    MatSidenavModule,
    MatIconModule,
    MatGridListModule,
    MatExpansionModule,
    MatPaginatorModule,
    MatTableModule,
    MatSortModule,
    MatSnackBarModule,
    MatMenuModule,
    MatButtonModule,
    HomeComponent,
    NewsComponent,
    ChampionshipComponent,
    KleinfeldTurnierComponent,
    DuckrunComponent,
    GoldenshotComponent,
    PassworddialogComponent,
    TickerComponent,
    ImagesliderComponent,
    HvtdpImageComponent,
    HallenturnierComponent,
    HallofpappComponent,
    BigdartsComponent,
    ContactComponent,
    BocciaComponent,
    FanshopComponent,
  ],
  bootstrap: [AppComponent],
  providers: [
    MysqlService,
    StatisticsService,
    RedirectGuard,
    CookieService,
    { provide: LocationStrategy, useClass: HashLocationStrategy },
    { provide: MAT_SNACK_BAR_DEFAULT_OPTIONS, useValue: { duration: 2500 } },
    provideHttpClient(withInterceptorsFromDi(), withJsonpSupport()),
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class AppModule {}
