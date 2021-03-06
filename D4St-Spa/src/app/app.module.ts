import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule } from "@angular/common/http";
import { FormsModule } from "@angular/forms";
import { TooltipModule } from "ngx-bootstrap/tooltip";
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { DemoDropdownCustomHtmlComponent } from "../_NGXCustom/DemoDropdownCustomHtml/DemoDropdownCustomHtml.component";
import { CustomCompareTooltipComponent } from "../_NGXCustom/CustomCompareTooltip/CustomCompareTooltip.component";

import { AppComponent } from './app.component';
import { HomeComponent } from '../home/home.component';
import { PowersComponent } from '../powers/powers.component';
import { SkillsComponent } from '../skills/skills.component';
import { ApiServiceService } from 'src/_Services/ApiService.service';
import { StatsComponent } from '../stats/stats.component';
import { SkillPickerComponent } from '../skillPicker/skillPicker.component';
import { SkillBarComponent } from '../skillBar/skillBar.component';
import { SafePipe } from './safe.pipe';

import { ItemGeneratorComponent } from './item-generator/item-generator.component';
import { InventoryComponent } from './inventory/inventory.component';

@NgModule({
   declarations: [
      AppComponent,
      HomeComponent,
      PowersComponent,
      SkillsComponent,
      StatsComponent,
      SkillPickerComponent,
      SkillBarComponent,
      SafePipe,
      DemoDropdownCustomHtmlComponent,
      CustomCompareTooltipComponent,
      ItemGeneratorComponent,
      InventoryComponent
   ],
   imports: [
      BrowserModule,
      HttpClientModule,
      FormsModule,
      TooltipModule.forRoot(),
      BsDropdownModule.forRoot(),
      BrowserAnimationsModule,
      TooltipModule.forRoot()
   ],
   providers: [
      ApiServiceService
   ],
   bootstrap: [
      AppComponent
   ]
})
export class AppModule { }
