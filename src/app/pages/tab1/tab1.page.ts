import { Component, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { IonInfiniteScroll, LoadingController, ModalController, NavController, ToastController } from '@ionic/angular';
import { TranslateService } from '@ngx-translate/core';
import { AppComponent } from '../../app.component';
import { EditNotePage } from '../modals/edit-note/edit-note.page';
import { Note } from '../../model/Note';
import { NoteService } from '../../services/note.service';
import { NotificationsService } from '../../services/notifications.service';

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss']
})
export class Tab1Page {
  @ViewChild(IonInfiniteScroll) infinite: IonInfiniteScroll;

  public notesCopy: Note[] = [];
  public notas: Note[] = [];
  private loaded: boolean;
  private isSearching: boolean;

  constructor(private ns: NoteService, private modalController: ModalController, private notS: NotificationsService, 
    private translator:TranslateService, private router:Router, private navCtrl:NavController) { }

  async ionViewDidEnter() {
    await this.cargaNotas();
  }

  public async borra(nota: Note) {
    if (await this.notS.presentAlertConfirm(this.translator.instant('CONFIRMATION'),this.translator.instant('CONF_MSG'),
    this.translator.instant('YES'),this.translator.instant('CANCEL'))) {
      
      await this.notS.presentLoading();

      try{
        await this.ns.remove(nota.key);
        await this.notS.dismissLoading();
        let i = this.notas.indexOf(nota, 0);
        if (i > -1) {
          this.notas.splice(i, 1);
          this.loaded=true;
          if(this.isSearching){
            this.notesCopy.splice(this.notesCopy.indexOf(nota),1);
          }
        }
        await this.notS.dismissLoading();
        await this.notS.presentToast(this.translator.instant('NOTE_DELETED'), "success");
      }catch(err){
        await this.notS.dismissLoading();
        await this.notS.presentToast(this.translator.instant('DEL_NOTE_ERR'), "danger");
      }
    }
  }

  async editNoteModal(nota: Note) {
    const modal = await this.modalController.create({
      component: EditNotePage,
      cssClass: 'my-custom-class',
      componentProps: {
        'note': nota,
      }
    });

    await modal.present();
  }

  public async cargaNotas(event?) {
    if (this.infinite) {
      this.infinite.disabled = false;
    }
    if (!event) {
      this.notS.presentLoading();
    }
    this.notas = [];
    try {
      this.notas = await this.ns.getNotesByPage('algo').toPromise();
      this.loaded=true;
    } catch (err) {
      this.notas = [];
      //console.error(err);
      await this.notS.presentToast(this.translator.instant('LOADING_ERR'), "danger")
      //notificar el error al usuario
    } finally {
      //ocultar el loading
      if (event) {
        event.target.complete();
      } else {
        await this.notS.dismissLoading();
      }
    }
  }

  public async cargaInfinita($event) {
    let nuevasNotas = await this.ns.getNotesByPage().toPromise();
    if (nuevasNotas.length < 10) {
      $event.target.disabled = true;
    }
    this.notas = this.notas.concat(nuevasNotas);
    $event.target.complete();
  }

  public async search($event){
    //Hago una copia de las notas actuales
    if(this.loaded&&!this.isSearching){
      this.notesCopy=[];
      this.notas.forEach(note=>{
        this.notesCopy.push(note);
      });
      this.loaded=false;
    }

    if($event.detail.value!=""){ //Si se ha escrito algo en la barra de busqueda, filtro las notas
      this.notas=[];
      this.isSearching=true;

      this.notesCopy.forEach((note) => {
        if(note.title.toLowerCase().includes($event.detail.value.toLowerCase())){    
          this.notas.push(note);
        }
      });
    }else{ //Si no, reseteo las notas con la copia
      this.notas=[];
      this.isSearching=false;
      this.notesCopy.forEach(note=>{
        this.notas.push(note);
      })
    }
  }

  public viewNote(note:Note){
    this.navCtrl.navigateForward(['private/tabs/tab3',{data: JSON.stringify(note)}]);
  }
}
