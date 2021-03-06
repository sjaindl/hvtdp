import { Routes } from '@angular/router';

import { HomeComponent } from '../home/home.component';
import { TeamComponent } from '../team/team.component';
import { NewsComponent } from '../news/news.component';
import { ChampionshipComponent } from '../championship/championship.component';
import { GalleryComponent } from '../gallery/gallery.component';
import { SocialmediaComponent } from '../socialmedia/socialmedia.component';
import { DonationsComponent } from '../donations/donations.component';
import { AboutComponent } from '../about/about.component';
import { ContactComponent } from '../contact/contact.component';
import { FanshopComponent } from '../fanshop/fanshop.component';
import { MembershipComponent } from '../membership/membership.component';
import { HalloffameComponent } from '../halloffame/halloffame.component';
import { DocumentsComponent } from '../documents/documents.component';
import { SurveysComponent } from '../surveys/surveys.component';
import { StartingelevenComponent } from '../startingeleven/startingeleven.component';
import { HallofpappComponent } from '../hallofpapp/hallofpapp.component';
import { DuckrunComponent } from '../duckrun/duckrun.component';

export const routes : Routes = [
    {path: "home", component: HomeComponent},
    {path: "", redirectTo: "/home", pathMatch: "full"},
    {path: "duckrun", component: DuckrunComponent},
    {path: "news", component: NewsComponent},
    {path: "news/:newsId", component: NewsComponent},
    {path: "team", component: TeamComponent},
    {path: "championship", component: ChampionshipComponent},
    {path: "gallery", component: GalleryComponent},
    {path: "social", component: SocialmediaComponent},
    {path: "donation", component: DonationsComponent},
    {path: "about", component: AboutComponent},
    {path: "contact", component: ContactComponent},
    {path: "fanshop", component: FanshopComponent},
    {path: "membership", component: MembershipComponent},
    {path: "halloffame", component: HalloffameComponent},
    {path: "documents", component: DocumentsComponent},
    {path: "surveys", component: SurveysComponent},
    {path: "startingeleven", component: StartingelevenComponent},
    {path: "hallofpapp", component: HallofpappComponent}
];
