import { Routes } from '@angular/router';
import { MainPage } from './views/main-page/main-page';
import { PlayPage } from './views/play/play-page';
import { PresentPage } from './views/present/present-page';

export const routes: Routes = [
  {
    path: "",
    component: MainPage
  },
  {
    path: "play",
    component: PlayPage
  },
  {
    path: "present",
    component: PresentPage
  },
  {
    path: "**",
    component: MainPage
  }


];
