import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { EditNotePageRoutingModule } from './edit-note-routing.module';

import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    EditNotePageRoutingModule,
    ReactiveFormsModule,
    TranslateModule
  ],
  providers:[TranslateModule]
  //declarations: [EditNotePage]
})
export class EditNotePageModule {}
