import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { LoadingController, ToastController } from '@ionic/angular';
import { TranslateService } from '@ngx-translate/core';
import { Note } from '../../model/Note';
import { NoteService } from '../../services/note.service';
import { NotificationsService } from '../../services/notifications.service';

@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss']
})
export class Tab2Page {

  public formNota:FormGroup;

  constructor(private fb:FormBuilder, private noteS:NoteService, private notS:NotificationsService, private translator:TranslateService) {
    this.formNota=this.fb.group({
      title:["",Validators.required],
      description:[""]
    });
  }

  public async addNote(){
    let newNote:Note={
      title:this.formNota.get("title").value,
      description:this.formNota.get("description").value
    }

    await this.notS.presentLoading();

    try{
      let id=await this.noteS.addNote(newNote)
      await this.notS.dismissLoading();
      await this.notS.presentToast(this.translator.instant('NOTE_ADDED'), "success");
      this.formNota.reset();
    }catch(err){
      await this.notS.dismissLoading();
      await this.notS.presentToast(this.translator.instant('ADDING_NOTE_ERR'), "danger");
    }
  }
}
