import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDialogModule } from '@angular/material/dialog';
import { MatDividerModule } from '@angular/material/divider';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatListModule } from '@angular/material/list';
import { MatMenuModule } from '@angular/material/menu';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSelectModule } from '@angular/material/select';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MAT_SNACK_BAR_DEFAULT_OPTIONS, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatSortModule } from '@angular/material/sort';
import { MatTableModule } from '@angular/material/table';
import { MatToolbarModule } from '@angular/material/toolbar';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppRoutingModule } from './app-routing/app-routing.module';

import { HashLocationStrategy, LocationStrategy } from '@angular/common';
import { provideHttpClient, withInterceptorsFromDi, withJsonpSupport } from '@angular/common/http';
import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { GoogleMapsModule } from '@angular/google-maps';
import { CookieService } from 'ngx-cookie-service';

import { RedirectGuard } from './app-routing/redirect-guard';
import { AppComponent } from './app.component';
import { MysqlService } from './services/mysql.service';
import { StatisticsService } from './services/statistics.service';

import { AboutComponent } from './about/about.component';
import { AdventComponent } from './advent/advent.component';
import { BigdartsComponent } from './bigdarts/bigdarts.component';
import { BocciaComponent } from './boccia/boccia.component';
import { ChampionshipComponent } from './championship/championship.component';
import { ComedyhirtenComponent } from './comedyhirten/comedyhirten.component';
import { ContactComponent } from './contact/contact.component';
import { DocumentsComponent } from './documents/documents.component';
import { DonationsComponent } from './donations/donations.component';
import { DuckrunComponent } from './duckrun/duckrun.component';
import { FanshopComponent } from './fanshop/fanshop.component';
import { FooterComponent } from './footer/footer.component';
import { GalleryComponent } from './gallery/gallery.component';
import { GoalOfTheSeasonComponent } from './goaloftheseason/goaloftheseason.component';
import { GoldenshotVotingComponent } from './goldenshot-voting/goldenshot-voting.component';
import { GoldenshotComponent } from './goldenshot/goldenshot.component';
import { HallenturnierComponent } from './hallenturnier/hallenturnier.component';
import { HalloffameComponent } from './halloffame/halloffame.component';
import { HallofpappComponent } from './hallofpapp/hallofpapp.component';
import { HeaderComponent } from './header/header.component';
import { HomeComponent } from './home/home.component';
import { HvtdpImageComponent } from './hvtdp-image/hvtdp-image.component';
import { ImagesliderComponent } from './imageslider/imageslider.component';
import { KleinfeldTurnierComponent } from './kleinfeldturnier/kleinfeldturnier.component';
import { MembershipComponent } from './membership/membership.component';
import { NewsComponent } from './news/news.component';
import { PassworddialogComponent } from './passworddialog/passworddialog.component';
import { SafePipe } from './pipes/SafePipe';
import { PlayerOfTheSeasonComponent } from './playeroftheseason/playeroftheseason.component';
import { SocialmediaComponent } from './socialmedia/socialmedia.component';
import { StadionFestComponent } from './stadionfest/stadionfest.component';
import { StartingelevenComponent } from './startingeleven/startingeleven.component';
import { SurveysComponent } from './surveys/surveys.component';
import { TeamComponent } from './team/team.component';
import { TickerComponent } from './ticker/ticker.component';
import { ZehnjahresfeierComponent } from './zehnjahresfeier/zehnjahresfeier.component';
import { VideoCardComponent } from './video-card/video-card.component';

@NgModule({
  declarations: [SafePipe],
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
    VideoCardComponent,
    HallenturnierComponent,
    HallofpappComponent,
    BigdartsComponent,
    ContactComponent,
    BocciaComponent,
    FanshopComponent,
    TeamComponent,
    SocialmediaComponent,
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
    StadionFestComponent,
    StartingelevenComponent,
    SurveysComponent,
    ZehnjahresfeierComponent,
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
