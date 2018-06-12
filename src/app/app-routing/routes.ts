import { Routes } from '@angular/router';

import { HomeComponent } from '../home/home.component';
import { TeamComponent } from '../team/team.component';

export const routes : Routes = [
    {path: "home", component: HomeComponent},
    {path: "", redirectTo: "/home", pathMatch: "full"},
    {path: "team", component: TeamComponent}
];
