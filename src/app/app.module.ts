import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import {HttpClientModule} from "@angular/common/http";
import {RouterModule, Routes} from "@angular/router";
import { FormsModule } from '@angular/forms';

import { SecretaryComponent } from './secretary/secretary.component';
import { Page_accueilComponent} from "./page_accueil/page_accueil.component";
import {Page_infirmierComponent} from "./page_infirmier/page_infirmier.component";
import {Page_patientComponent} from "./page_patient/page_patient.component";
import EntryComponent from "./entry/entry.component";

import {CabinetMedicalService} from "./services/cabinet-medical.service";
import {TileService} from "./services/tile.service";
import {ActesService} from "./services/actes.service";
import {ConstantsService} from "./services/constants.service";
import {AffectationService} from "./services/affectation.service";
import {AgmCoreModule} from "@agm/core";


const appRoutes: Routes = [
    {path: '', component: Page_accueilComponent, data:{style:0,content:"teste"}},
    {path: 'infirmier/:id', component: Page_infirmierComponent},
    {path: 'patient/:id', component: Page_patientComponent},
    {path: '**', redirectTo: '', pathMatch: "full"}
];

@NgModule({
  declarations: [
      SecretaryComponent,
      Page_accueilComponent,
      Page_infirmierComponent,
      Page_patientComponent,
      EntryComponent,
  ],
  imports: [
      BrowserModule,
      HttpClientModule,
      FormsModule,
      AgmCoreModule.forRoot({
          apiKey: 'AIzaSyAqW1hwjAN3wlnU2eD0KVm4LUPzHmPmdBM'
      }),
      RouterModule.forRoot(appRoutes)
  ],
  providers: [CabinetMedicalService, ActesService, TileService, ConstantsService, AffectationService],
  bootstrap: [EntryComponent ]
})
export class AppModule { }
