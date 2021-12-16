import { Component, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { IonMenu, IonToggle } from '@ionic/angular';
import { TranslateService } from '@ngx-translate/core';
import { AuthService } from './services/auth.service';
import { LocalStorageService } from './services/local-storage.service';
import { SplashScreen } from '@capacitor/splash-screen';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent {
  @ViewChild(IonMenu) menu: IonMenu;
  @ViewChild('mitoogle',{static:false}) mitoogle:IonToggle;

  public menuDisabled:boolean;
  private langSet:boolean=false;

  constructor(private traductor:TranslateService, private storage:LocalStorageService, private authS:AuthService,
    private router:Router) {}

  async ngOnInit(){
    await SplashScreen.show();

    if(this.langSet==false){
      const defaultLang=this.traductor.getBrowserLang();
      const userLang=await this.storage.getItem('lang')
      if(userLang){
        if(userLang.lang=='es'){
          this.mitoogle.checked=false;
        }else{
          this.mitoogle.checked=true;
        }
        this.traductor.use(userLang.lang);
      }else{
        if(defaultLang){
          if(defaultLang=='es'){
            this.mitoogle.checked=false; 
            this.traductor.use(defaultLang);
          }else{
            this.mitoogle.checked=true;
            this.traductor.use('en');
          }
        }
      }
      this.langSet=true;
    }
  }

  public async cambiaIdioma(event){
    if(event && event.detail && event.detail.checked){
      await this.storage.setItem('lang', {lang:'en'});
      this.traductor.use('en');
    }else{
      await this.storage.setItem('lang', {lang:'es'}); 
      this.traductor.use('es');
    }
  }

  public async logout(){
    await this.authS.logout()
    this.router.navigate(['']);
    this.menu.close();
  }

  public disableMenu() {
    if(this.router.url=="/"){
      this.menuDisabled=true;
    }else{
      this.menuDisabled=false;
    }
  }
}
