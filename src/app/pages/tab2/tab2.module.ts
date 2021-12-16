import { IonicModule } from '@ionic/angular';
import { RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Tab2Page } from './tab2.page';
import { ExploreContainerComponentModule } from '../../explore-container/explore-container.module';

import { Tab2PageRoutingModule } from './tab2-routing.module';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  imports: [
    IonicModule,
    CommonModule,
    ExploreContainerComponentModule,
    Tab2PageRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    TranslateModule
  ],
  declarations: [Tab2Page],
  providers:[TranslateModule]
})
export class Tab2PageModule {}
