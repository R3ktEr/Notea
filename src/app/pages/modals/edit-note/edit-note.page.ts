import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ModalController } from '@ionic/angular';
import { TranslateService } from '@ngx-translate/core';
import { Note } from 'src/app/model/Note';
import { NoteService } from 'src/app/services/note.service';
import { NotificationsService } from 'src/app/services/notifications.service';

@Component({
  selector: 'app-edit-note',
  templateUrl: './edit-note.page.html',
  styleUrls: ['./edit-note.page.scss'],
})
export class EditNotePage implements OnInit {

  @Input() note:Note

  public formNota:FormGroup

  constructor(private fb:FormBuilder, private noteS:NoteService, private modalController:ModalController, private notS:NotificationsService,
    private translator:TranslateService) { }

  ngOnInit() {
    this.formNota=this.fb.group({
      title:["", Validators.required],
      description:[""]
    })
  }

  public async editNote(){
    await this.notS.presentLoading();

    try{
      this.note.title=this.formNota.get("title").value;
      this.note.description=this.formNota.get("description").value;
  
      await this.noteS.editNote(this.note);
      await this.notS.dismissLoading();
  
      await this.notS.presentToast(this.translator.instant('NOTE_EDITED'), "success");
      this.closeModal();
    }catch(err){
      await this.notS.presentToast(this.translator.instant('EDIT_NOTE_ERR'), "danger");
    }

  }

  public closeModal(){
    this.modalController.dismiss();
  }
}
