import { IonicModule } from '@ionic/angular';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Tab1Page } from './tab1.page';
import { ExploreContainerComponentModule } from '../../explore-container/explore-container.module';

import { Tab1PageRoutingModule } from './tab1-routing.module';
import { EditNotePage } from '../modals/edit-note/edit-note.page';
import { EditNotePageModule } from '../modals/edit-note/edit-note.module';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
    ExploreContainerComponentModule,
    Tab1PageRoutingModule,
    ReactiveFormsModule,
    EditNotePageModule,
    TranslateModule
  ],
  declarations: [Tab1Page, EditNotePage],
  entryComponents:[EditNotePage],
  providers:[TranslateModule]
})
export class Tab1PageModule {}
