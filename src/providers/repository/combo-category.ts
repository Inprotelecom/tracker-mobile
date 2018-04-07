import { Injectable } from '@angular/core';
import { SQLite, SQLiteObject } from '@ionic-native/sqlite';
import { ComboCategory} from '../../app/clases/entities/combo-category';
import { Platform } from 'ionic-angular';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { DB_CONFIG} from '../../config/app-constants';
import { Observable } from 'rxjs';

@Injectable()
export class ComboCategoryRepository {

public sqlite: SQLite;

db: SQLiteObject = null;
constructor(private platform:Platform) {

}

public insert(entity: ComboCategory):Observable<boolean>{
      console.log("Inser ComboCategory")
    return  Observable.create(observer=>{
         this.platform.ready().then(() => {
         this.sqlite = new SQLite();
         this.sqlite.create(DB_CONFIG).then((db:SQLiteObject) => {
                let sql = 'INSERT INTO COMBO_CATEGORY (ID_COMBO_CATEGORY, NM_COMBO_CATEGORY) VALUES(?,?)';
                      db.executeSql(sql, [entity.comboCategoryId,entity.name])
                      .then(()=>{
                        console.info('Executed SQL');
                        observer.next(true);
                        observer.complete();
                       }).catch(e=> {
                         console.log("Error inserting 1:"+JSON.stringify(e));
                         let message:string=e.message;
                         message=message.toUpperCase();
                         if((message.indexOf("UNIQUE CONSTRAINT FAILED"))){
                           console.log("UNIQUE CONSTRAINT FAILED");
                           this.update(entity).subscribe(resp=>{
                             console.log("Observable resp update:"+resp);
                           });
                           observer.next(true);
                           observer.complete();
                         }else{
                           observer.next(false);
                           observer.complete();
                         }
                       });

               }).catch(e=>{
                    console.error("Error inserting 2:"+JSON.stringify(e));
                    observer.next(false);
                    observer.complete();
                  });

           }).catch(e => {
                  console.error("Error opening database: " + JSON.stringify(e));
                  observer.next(false);
                  observer.complete();
          });

          });


  }

  public update(entity: ComboCategory):Observable<boolean>{
      return Observable.create(observer=>{
        this.platform.ready().then(() => {
                 this.sqlite = new SQLite();
                 this.sqlite.create(DB_CONFIG).then((db) => {
                     let sql = 'UPDATE COMBO_CATEGORY SET NM_COMBO_CATEGORY=? WHERE ID_COMBO_CATEGORY=?';
                     //  console.info("going to insert etype:"+JSON.stringify(entity));

                           db.executeSql(sql, [entity.comboCategoryId, entity.name])
                           .then(res=>{
                             console.log('Executed SQL wi update');
                             observer.next(true);
                             observer.complete();
                           }).catch(e=>{
                                console.log("Error updating:"+JSON.stringify(e));

                                  observer.next(true);
                                  observer.complete();
                           });

                         }).catch(e=>{
                                 console.log("Error inserting 2:"+JSON.stringify(e));
                                 observer.next(false);
                                 observer.complete();
                         });

                     }).catch(e => {
                               console.info("Error opening database: " + JSON.stringify(e));
                               observer.next(false);
                               observer.complete();
                     });


      });

   }

   public findById(comboCategoryId:number):Observable<ComboCategory>{
     let comboCategory:ComboCategory =null;
     return  Observable.create(observer=>{
         this.platform.ready().then(() => {
         this.sqlite = new SQLite();
         this.sqlite.create(DB_CONFIG).then((db:SQLiteObject) => {

                  let sql = 'SELECT ID_COMBO_CATEGORY, NM_COMBO_CATEGORY FROM COMBO_CATEGORY WHERE ID_COMBO_CATEGORY='+ comboCategoryId;
                    db.executeSql(sql, {}).then(res => {
                       //console.info('Executed SQL'+JSON.stringify(res)+'-caseId'+caseId);
                           if(res.rows.length>0){
                             comboCategory=new ComboCategory();
                             comboCategory.comboCategoryId=res.rows.item(0).ID_ATTRIBUTE;
                             comboCategory.name=res.rows.item(0).CD_ATTRIBUTE;
                            }
                          observer.next(comboCategory);
                          observer.complete();
                       }).catch(e=>{
                     console.error("Error querying:"+JSON.stringify(e));
                     observer.next(false);
                     observer.complete();
                   });

            }).catch(e => {
                   console.error("Error opening database: " + JSON.stringify(e));
                   observer.next(false);
                   observer.complete();
           });

           });

     })
  }


}
