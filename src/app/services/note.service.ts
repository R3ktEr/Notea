import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection, DocumentReference } from '@angular/fire/compat/firestore'
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Note } from '../model/Note';
import { AuthService } from './auth.service';


@Injectable({
  providedIn: 'root'
})
export class NoteService {
  private last:any=null;
  private myCollection:AngularFirestoreCollection;
  private myCollectionString:string;

  constructor(private db:AngularFirestore, private authS:AuthService) {
    this.checkDatabase();
  }

  public checkDatabase() {
    if(this.authS.user!=null){
      this.myCollectionString=this.authS.user.email;
      this.myCollection=this.db.collection<any>(this.myCollectionString);
    }else{
      this.myCollection=this.db.collection<any>(environment.firebaseConfig.todoCollection)
    }
  }

  public addNote(note:Note):Promise<string>{
    return new Promise(async (resolve, rejects)=>{
      try{
        let response:DocumentReference<firebase.default.firestore.DocumentData> = await this.myCollection.add(note);
        resolve(response.id);
      }catch(err){
        rejects(err);
      }
    });
  }

  /**
   * getNotesByPage() -> page=1,criteria=undefined
   * getNotesByPage(2) -> page=2,criteria=undefined
   * getNotesByPage(1, 'title')
   * .orderBy(criteria,'desc')
   * @param page
   * @param criteria 
   */
   public getNotesByPage(all?):Observable<Note[]> {
    if(all){
      this.last=null;
    }
    return new Observable((observer) => {
      let result: Note[] = [];
      let query=null;
      if(this.last){
        query=this.db.collection<any>(this.myCollectionString,
          ref => ref.limit(15).startAfter(this.last));
      }else{
        query=this.db.collection<any>(this.myCollectionString,
          ref => ref.limit(15));
      }
      
        
        query.get()
        .subscribe(
          (data: firebase.default.firestore.QuerySnapshot<firebase.default.firestore.DocumentData>) => {
            data.docs.forEach((d: firebase.default.firestore.DocumentData) => {
              this.last=d;
              let tmp = d.data(); //devuelve el objeto almacenado -> la nota con title y description
              let id = d.id; //devuelve la key del objeto
              result.push({ 'key': id, ...tmp });
              //operador spread-> 'title':tmp.title,'description':tmp.description
            })
            observer.next(result);  ///este es el return del observable que devolvemos
            observer.complete();
          }) //final del subscribe
    }); //final del return observable
  }

  public getNotes():Observable<Note[]>{
    return new Observable((observer)=>{
      let result:Note[]=[];
      
      this.myCollection.get().subscribe((data:firebase.default.firestore.QuerySnapshot<firebase.default.firestore.DocumentData>)=>{
        data.docs.forEach((d:firebase.default.firestore.DocumentData)=>{
          let tmp=d.data(); //devuelve el objeto almacenado -> la nota con title
          let id=d.id; //devuelve la key del objeto
          result.push({'key':id,...tmp});
          //operador spread-> 'title':tpm.title, 'description':tmp.description
        });
        observer.next(result);
        observer.complete();
      });
    });
  }

  public getNote(id:string):Promise<Note>{
    return new Promise(async (resolve,reject)=>{
       let note:Note=null;
       try{
         let result:firebase.default.firestore.DocumentData=await this.myCollection.doc(id).get().toPromise();
         note={
           id:result.id,
           ...result.data()
         }
         resolve(note);
       }catch(err){
         reject(err);
       }
    })
  }

  public async editNote(nota:Note):Promise<void>{  
    try{
      let data:Partial<firebase.default.firestore.DocumentData>={
        title:nota.title,
        description:nota.description
      };
      
      await this.myCollection.doc(nota.key).update(data);
    }catch(err){
      //console.error(err);
    }
  }

  public remove(id:string):Promise<void>{
    return this.myCollection.doc(id).delete();
  }
}
