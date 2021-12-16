import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { GoogleAuth } from '@codetrix-studio/capacitor-google-auth'
import { User } from '@codetrix-studio/capacitor-google-auth/dist/esm/user';
import { Platform } from '@ionic/angular';
import { TranslateService } from '@ngx-translate/core';
import { AuthService } from 'src/app/services/auth.service';
import { NoteService } from 'src/app/services/note.service';
import { NotificationsService } from 'src/app/services/notifications.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {

  public userinfo:User;
  private isAndroid:boolean;
  public form:FormGroup

  constructor(private platform:Platform, private authS:AuthService, private router:Router, private fb:FormBuilder, 
    private notS:NotificationsService, private noteS:NoteService, private translator:TranslateService) {
    this.isAndroid=this.platform.is("android");
    this.form=this.fb.group({
      email:["", Validators.required],
      password:["",Validators.required]
    })
  }

  async ngOnInit() {
    try{
      await this.authS.loadSession();
    }catch(err){
      //console.log(err)
    }

    if(this.authS.isLogged()){
      await this.noteS.checkDatabase();
      this.router.navigate(['private/tabs/tab1']);
    }
  }

  ionViewWillEnter(){
    this.platform.ready().then(async()=>{
      await GoogleAuth.init(); //lee la config clientid del meta de index.html
      await this.authS.loadSession();
    })
  
    if(this.authS.isLogged()){
      this.router.navigate(['private/tabs/tab1']);
    }
  }

  public async signin(){
    try {
      await this.authS.login();
      this.noteS.checkDatabase()
      this.router.navigate(['private/tabs/tab1']);
    } catch (err) {
      //console.error(err);
    }
  }

  public register(){
    this.router.navigate(['register']);
  }

  public async loginWithMail() {
    let userdata={
      email: this.form.get("email").value,
      password: this.form.get("password").value
    }
    
    await this.notS.presentLoading();

    try{
      await this.authS.login(userdata);
      this.noteS.checkDatabase()
      this.router.navigate(['private/tabs/tab1']);
    }catch(err){
      this.notS.presentToast(this.translator.instant("WRONG_PASSWORD"), "danger");
    }

    await this.notS.dismissLoading();
  }
}
