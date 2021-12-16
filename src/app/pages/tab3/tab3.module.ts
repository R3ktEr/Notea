import { IonicModule } from '@ionic/angular';
import { RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Tab3Page } from './tab3.page';
import { ExploreContainerComponentModule } from '../../explore-container/explore-container.module';

import { Tab3PageRoutingModule } from './tab3-routing.module';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { NgxQRCodeModule } from 'ngx-qrcode2';

@NgModule({
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
    TranslateModule,
    ExploreContainerComponentModule,
    RouterModule.forChild([{ path: '', component: Tab3Page }]),
    Tab3PageRoutingModule,
    NgxQRCodeModule
  ],
  declarations: [Tab3Page],
  providers:[TranslateService]
})
export class Tab3PageModule {}
