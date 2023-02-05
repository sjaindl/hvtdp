import { AppRoutingModule } from './app-routing/app-routing.module'
import { BrowserModule } from '@angular/platform-browser'
import { BrowserAnimationsModule } from '@angular/platform-browser/animations'
import { FlexLayoutModule } from '@angular/flex-layout'

import { MatIconModule } from '@angular/material/icon'
import { MatToolbarModule } from '@angular/material/toolbar'
import { MatListModule } from '@angular/material/list'
import { MatDialogModule } from '@angular/material/dialog'
import { MatDividerModule } from '@angular/material/divider'
import { MatSidenavModule } from '@angular/material/sidenav'
import { MatGridListModule } from '@angular/material/grid-list'
import { MatInputModule } from '@angular/material/input'
import { MatFormFieldModule } from '@angular/material/form-field'
import { MatSlideToggleModule } from '@angular/material/slide-toggle'
import { MatSelectModule } from '@angular/material/select'
import { MatCheckboxModule } from '@angular/material/checkbox'
import { MatExpansionModule } from '@angular/material/expansion'
import { MatPaginatorModule } from '@angular/material/paginator'
import { MatTableModule } from '@angular/material/table'
import { MatSortModule } from '@angular/material/sort'
import { MatSnackBarModule, MAT_SNACK_BAR_DEFAULT_OPTIONS } from '@angular/material/snack-bar'
import { MatMenuModule } from '@angular/material/menu'

import { NgModule } from '@angular/core'

import { AppComponent } from './app.component'
import { HomeComponent } from './home/home.component'
import { HeaderComponent } from './header/header.component'
import { FooterComponent } from './footer/footer.component'

import { Hammer } from 'hammerjs/hammer'
import { TeamComponent } from './team/team.component'
import { NguCarouselModule } from '@ngu/carousel'
import { NewsComponent } from './news/news.component'
import { ChampionshipComponent } from './championship/championship.component'
import { GalleryComponent } from './gallery/gallery.component'
import { SocialmediaComponent } from './socialmedia/socialmedia.component'
import { DonationsComponent } from './donations/donations.component'
import { AboutComponent } from './about/about.component'
import { ContactComponent } from './contact/contact.component'
import { DuckrunComponent } from './duckrun/duckrun.component'
import { FanshopComponent } from './fanshop/fanshop.component'
import { MembershipComponent } from './membership/membership.component'
import { HalloffameComponent } from './halloffame/halloffame.component'
import { GoogleMapsModule } from '@angular/google-maps'
import { FormsModule, ReactiveFormsModule } from '@angular/forms'
import { DocumentsComponent } from './documents/documents.component'
import { SurveysComponent } from './surveys/surveys.component'
import { MysqlService } from './services/mysql.service'

import { LocationStrategy, HashLocationStrategy } from '@angular/common'
import { HttpClientModule, HttpClientJsonpModule } from '@angular/common/http'
import { StatisticsService } from './services/statistics.service'
import { StartingelevenComponent } from './startingeleven/startingeleven.component'
import { HallofpappComponent } from './hallofpapp/hallofpapp.component'
import { PassworddialogComponent } from './passworddialog/passworddialog.component'
import { SafePipe } from './pipes/SafePipe'
import { AdventComponent } from './advent/advent.component'
import { NgcCookieConsentModule, NgcCookieConsentConfig } from 'ngx-cookieconsent'
import { GoalOfTheSeasonComponent } from './goaloftheseason/goaloftheseason.component'
import { HallenturnierComponent } from './hallenturnier/hallenturnier.component'

const cookieConfig: NgcCookieConsentConfig = {
  cookie: {
    domain: 'hvtdpstainz.at'
  },
  palette: {
    popup: {
      background: '#c2185b'
    },
    button: {
      background: '#f1d600'
    }
  },
  theme: 'edgeless',
  type: 'opt-out'
}

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
    GoalOfTheSeasonComponent,
    StartingelevenComponent,
    HallofpappComponent,
    PassworddialogComponent,
    DuckrunComponent,
    AdventComponent,
    HallenturnierComponent,
    SafePipe
  ],
  imports: [
    BrowserModule.withServerTransition({ appId: 'serverApp' }) ,
    BrowserAnimationsModule,
    MatListModule,
    MatCheckboxModule,
    MatDialogModule,
    MatDividerModule,
    MatToolbarModule,
    MatInputModule,
    MatFormFieldModule,
    MatSlideToggleModule,
    MatSelectModule,
    FlexLayoutModule, 
    AppRoutingModule,
    NguCarouselModule,
    MatSidenavModule,
    MatIconModule,
    MatGridListModule,
    MatExpansionModule,
    MatPaginatorModule,
    MatTableModule,
    MatSortModule,
    MatSnackBarModule,
    MatMenuModule,
    GoogleMapsModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    HttpClientJsonpModule,
    NgcCookieConsentModule.forRoot(cookieConfig)
  ],
  providers: [
    MysqlService, 
    StatisticsService, 
    { provide: LocationStrategy, useClass: HashLocationStrategy },
    { provide: MAT_SNACK_BAR_DEFAULT_OPTIONS, useValue: {duration: 2500} }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
