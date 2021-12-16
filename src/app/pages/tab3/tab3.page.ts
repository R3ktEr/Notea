import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Note } from '../../model/Note';
import { BarcodeScanner } from '@capacitor-community/barcode-scanner';
import { NotificationsService } from '../../services/notifications.service';

@Component({
  selector: 'app-tab3',
  templateUrl: 'tab3.page.html',
  styleUrls: ['tab3.page.scss']
})
export class Tab3Page {
  public note:Note;
  private datacoming:any;

  public qrdata:any;
  public createCode:any;

  private result:any;
  public scanActive:boolean;

  constructor(private route:ActivatedRoute, private notS:NotificationsService) {
    this.datacoming=this.route.snapshot.params['data'];
    if(this.datacoming){
      try{
        this.note=JSON.parse(this.datacoming);
      }catch(err){
        //console.log(err);
      }
    }

    this.createCode='';
    this.result=null;
    this.scanActive=false;
  }

  public create(){
    this.createCode=JSON.stringify(this.note);
  }

  public clear(){
    this.createCode='';
  }

  ngAfterViewInit(){
    try{
      BarcodeScanner.prepare();
    }catch(err){}
  }

  ngOnDestroy(){
    try{
      BarcodeScanner.stopScan();
    }catch(err){}
  }

  ionViewDidLeave(){
    try{
      BarcodeScanner.stopScan();
      this.scanActive=false;
    }catch(err){}
  }

  public async startScanner(){
    try{
      const allowed = await this.checkPermission();
  
      if(allowed){
        this.scanActive=true;
        BarcodeScanner.hideBackground(); // make background of WebView transparent
      
        const result = await BarcodeScanner.startScan(); // start scanning and wait for a result
  
        if(result.hasContent){
          this.result=result.content;
          this.scanActive=false;
       
          try{
            this.note=JSON.parse(this.result)
          }catch(err){
            console.log(err)
            this.notS.presentToast("Error. El codigo escaneado no es una nota", "danger");
          }
        }
      }else{
        this.notS.presentToast("Aviso. Se necesitan permisos para acceder a la camara", "warning");
      }
    }catch(err){
      //console.log(err);
    }
  }

  public async checkPermission(){
    return new Promise(async(resolve, reject) => {
      try{
        // check or request permission
        const status = await BarcodeScanner.checkPermission({ force: true });
      
        if (status.granted) {
          // the user granted permission
          resolve(true);
        }else if(status.denied){
          resolve(false);
        }
      }catch(err){
        reject();
      }
    });
  }

  public async stopScanner(){
    try{
      await BarcodeScanner.stopScan();
      this.scanActive=false;
    }catch(err){}
  }
}
