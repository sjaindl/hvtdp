import { Routes } from '@angular/router';

import { AboutComponent } from '../about/about.component';
import { AdventComponent } from '../advent/advent.component';
import { ClubEventComponent } from '../club-event/club-event.component';
import { ChampionshipComponent } from '../championship/championship.component';
import { ContactComponent } from '../contact/contact.component';
import { DocumentsComponent } from '../documents/documents.component';
import { DonationsComponent } from '../donations/donations.component';
import { FanshopComponent } from '../fanshop/fanshop.component';
import { GoldenshotComponent } from '../goldenshot/goldenshot.component';
import { GalleryComponent } from '../gallery/gallery.component';
import { GoalOfTheSeasonComponent } from '../goaloftheseason/goaloftheseason.component';
import { HallenturnierComponent } from '../hallenturnier/hallenturnier.component';
import { HallofpappComponent } from '../hallofpapp/hallofpapp.component';
import { HomeComponent } from '../home/home.component';
import { MembershipComponent } from '../membership/membership.component';
import { NewsComponent } from '../news/news.component';
import { LegalPageComponent } from '../legal-page/legal-page.component';
import { NotFoundComponent } from '../not-found/not-found.component';
import { PlayerOfTheSeasonComponent } from '../playeroftheseason/playeroftheseason.component';
import { SocialmediaComponent } from '../socialmedia/socialmedia.component';
import { StartingelevenComponent } from '../startingeleven/startingeleven.component';
import { SurveysComponent } from '../surveys/surveys.component';
import { TeamComponent } from '../team/team.component';

export const routes: Routes = [
  { path: 'home', component: HomeComponent },
  { path: '', redirectTo: '/home', pathMatch: 'full' },
  { path: 'news', component: NewsComponent },
  { path: 'news/:newsId', component: NewsComponent },
  { path: 'team', component: TeamComponent },
  // Without a season the newest season from Strapi is shown.
  { path: 'championship', component: ChampionshipComponent },
  { path: 'championship/:season', component: ChampionshipComponent },
  { path: 'gallery', component: GalleryComponent },
  { path: 'gallery/:season/:albumId', component: GalleryComponent },
  { path: 'gallery/:season', component: GalleryComponent },
  { path: 'social', component: SocialmediaComponent },
  { path: 'social/:season', component: SocialmediaComponent },
  { path: 'donation', component: DonationsComponent },
  { path: 'about', component: AboutComponent },
  { path: 'contact', component: ContactComponent },
  { path: 'impressum', component: LegalPageComponent, data: { slug: 'impressum' } },
  { path: 'datenschutz', component: LegalPageComponent, data: { slug: 'datenschutz' } },
  { path: 'fanshop', component: FanshopComponent },
  { path: 'membership', component: MembershipComponent },
  { path: 'documents', component: DocumentsComponent },
  { path: 'surveys', component: SurveysComponent },
  { path: 'goaloftheseason', component: GoalOfTheSeasonComponent },
  { path: 'goaloftheseason/:season', component: GoalOfTheSeasonComponent },
  { path: 'playeroftheseason', component: PlayerOfTheSeasonComponent },
  { path: 'playeroftheseason/:season', component: PlayerOfTheSeasonComponent },
  { path: 'startingeleven', component: StartingelevenComponent },
  { path: 'hallofpapp', component: HallofpappComponent },
  { path: 'advent', component: AdventComponent },
  { path: 'advent/:season', component: AdventComponent },
  { path: 'hallenturnier', component: HallenturnierComponent },
  // Event pages with registration/order; the slug selects the "Veranstaltung" in Strapi (hidden while inactive).
  { path: 'bocciaturnier', component: ClubEventComponent, data: { slug: 'bocciaturnier' } },
  { path: 'kleinfeldturnier', component: ClubEventComponent, data: { slug: 'kleinfeldturnier' } },
  { path: 'bigdarts', component: ClubEventComponent, data: { slug: 'bigdarts' } },
  { path: 'entenrennen', component: ClubEventComponent, data: { slug: 'entenrennen' } },
  // { path: '10-jahre-hvtdp', component: ZehnjahresfeierComponent },
  // { path: 'stadionfest', component: StadionFestComponent },
  { path: 'torschusschallenge', component: GoldenshotComponent },
  // { path: 'comedyhirten', component: ComedyhirtenComponent },
  // Old voting link: the voting is part of the challenge page now.
  { path: 'torschusschallenge-voting', redirectTo: 'torschusschallenge', pathMatch: 'full' },
  { path: '**', component: NotFoundComponent },
];
