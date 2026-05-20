import { Routes } from '@angular/router';

import { AboutComponent } from '../about/about.component';
import { AdventComponent } from '../advent/advent.component';
import { BigdartsComponent } from '../bigdarts/bigdarts.component';
import { BocciaComponent } from '../boccia/boccia.component';
import { ChampionshipComponent } from '../championship/championship.component';
import { ComedyhirtenComponent } from '../comedyhirten/comedyhirten.component';
import { ContactComponent } from '../contact/contact.component';
import { DocumentsComponent } from '../documents/documents.component';
import { DonationsComponent } from '../donations/donations.component';
import { FanshopComponent } from '../fanshop/fanshop.component';
import { GalleryComponent } from '../gallery/gallery.component';
import { GoalOfTheSeasonComponent } from '../goaloftheseason/goaloftheseason.component';
import { GoldenshotVotingComponent } from '../goldenshot-voting/goldenshot-voting.component';
import { GoldenshotComponent } from '../goldenshot/goldenshot.component';
import { HallenturnierComponent } from '../hallenturnier/hallenturnier.component';
import { HalloffameComponent } from '../halloffame/halloffame.component';
import { HallofpappComponent } from '../hallofpapp/hallofpapp.component';
import { HomeComponent } from '../home/home.component';
import { KleinfeldTurnierComponent } from '../kleinfeldturnier/kleinfeldturnier.component';
import { MembershipComponent } from '../membership/membership.component';
import { NewsComponent } from '../news/news.component';
import { PlayerOfTheSeasonComponent } from '../playeroftheseason/playeroftheseason.component';
import { SocialmediaComponent } from '../socialmedia/socialmedia.component';
import { StadionFestComponent } from '../stadionfest/stadionfest.component';
import { SurveysComponent } from '../surveys/surveys.component';
import { TeamComponent } from '../team/team.component';
import { ZehnjahresfeierComponent } from '../zehnjahresfeier/zehnjahresfeier.component';
import { RedirectGuard } from './redirect-guard';

export const routes: Routes = [
  { path: 'home', component: HomeComponent },
  { path: '', redirectTo: '/home', pathMatch: 'full' },
  // {path: "entenrennen", component: DuckrunComponent},
  { path: 'news', component: NewsComponent },
  { path: 'news/:newsId', component: NewsComponent },
  { path: 'team', component: TeamComponent },
  { path: 'championship/:season', component: ChampionshipComponent },
  { path: 'gallery/:season/:albumId', component: GalleryComponent },
  { path: 'gallery/:season', component: GalleryComponent },
  { path: 'social/:season', component: SocialmediaComponent },
  { path: 'donation', component: DonationsComponent },
  { path: 'about', component: AboutComponent },
  { path: 'contact', component: ContactComponent },
  { path: 'fanshop', component: FanshopComponent },
  { path: 'membership', component: MembershipComponent },
  { path: 'halloffame', component: HalloffameComponent },
  { path: 'documents', component: DocumentsComponent },
  { path: 'surveys', component: SurveysComponent },
  { path: 'goaloftheseason/:season', component: GoalOfTheSeasonComponent },
  { path: 'playeroftheseason/:season', component: PlayerOfTheSeasonComponent },
  //{path: "startingeleven", component: StartingelevenComponent},
  {
    path: 'startingeleven',
    canActivate: [RedirectGuard],
    component: RedirectGuard,
    data: {
      externalUrl: 'https://starting-eleven-2019.firebaseapp.com/home',
    },
  },
  { path: 'hallofpapp', component: HallofpappComponent },
  { path: 'advent/:season', component: AdventComponent },
  { path: 'hallenturnier', component: HallenturnierComponent },
  { path: 'kleinfeldturnier', component: KleinfeldTurnierComponent },
  { path: 'bocciaturnier', component: BocciaComponent },
  { path: '10-jahre-hvtdp', component: ZehnjahresfeierComponent },
  { path: 'stadionfest', component: StadionFestComponent },
  { path: 'torschusschallenge', component: GoldenshotComponent },
  { path: 'comedyhirten', component: ComedyhirtenComponent },
  { path: 'bigdarts', component: BigdartsComponent },
  { path: 'torschusschallenge-voting', component: GoldenshotVotingComponent },
];
