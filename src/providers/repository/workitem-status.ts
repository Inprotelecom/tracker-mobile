import { Injectable } from '@angular/core';
import { SQLite, SQLiteObject } from '@ionic-native/sqlite';
import { Platform } from 'ionic-angular';
import { DB_CONFIG} from '../../config/app-constants';
import { Observable } from 'rxjs';
import {WorkItemStatus} from "../../app/clases/entities/workitem-status";

@Injectable()
export class WorkItemStatusRepository {

public sqlite: SQLite;

db: SQLiteObject = null;
constructor(private platform:Platform) {

}

public insert(entity: WorkItemStatus):Observable<boolean>{
      console.log("Insert WorkItemStatus")
    return  Observable.create(observer=>{
         this.platform.ready().then(() => {
         this.sqlite = new SQLite();
         this.sqlite.create(DB_CONFIG).then((db:SQLiteObject) => {
                let sql = 'INSERT INTO WORK_ITEM_STATUS (ID_WORK_ITEM_STATUS,NM_WORK_ITEM_STATUS) VALUES(?,?)';
                      db.executeSql(sql, [entity.workitemStatusId,entity.name])
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

  public update(entity: WorkItemStatus):Observable<boolean>{
      return Observable.create(observer=>{
        this.platform.ready().then(() => {
                 this.sqlite = new SQLite();
                 this.sqlite.create(DB_CONFIG).then((db) => {
                     let sql = 'UPDATE WORK_ITEM_STATUS SET NM_WORK_ITEM_STATUS=? WHERE ID_WORK_ITEM_STATUS=?';
                     //  console.info("going to insert etype:"+JSON.stringify(entity));

                           db.executeSql(sql, [entity.name,entity.workitemStatusId])
                           .then(res=>{
                             console.log('Executed SQL WorkItemStatus');
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



}
