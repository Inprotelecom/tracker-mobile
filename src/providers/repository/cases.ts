import { Injectable } from '@angular/core';
import { SQLite, SQLiteObject } from '@ionic-native/sqlite';
import { Cases} from '../../app/clases/entities/cases';
import { Platform } from 'ionic-angular';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { DB_CONFIG} from '../../config/app-constants';
import { Observable } from 'rxjs';
import { UNIQUE_CONSTRAINT_FAILED_CODE} from '../../config/sqlite-error-constants';


@Injectable()
export class CasesRepository {

  public sqlite: SQLite;

  db: SQLiteObject = null;
  constructor(private platform:Platform) {

  }

  public update(entity: Cases):Observable<boolean>{
      console.log("Update Case")
    return  Observable.create(observer=>{
         this.platform.ready().then(() => {
         this.sqlite = new SQLite();
         this.sqlite.create(DB_CONFIG).then((db:SQLiteObject) => {
                let sql = 'UPDATE CASES SET ID_ELEMENT=?, ID_ELEMENT_TYPE=?, ID_CASE_STATUS=? ,NR_CASE=?, FG_SHARED=?,DT_SHARED=?'
                          +'WHERE ID_CASE=?';
                      db.executeSql(sql, [entity.elementId, entity.elementTypeId,entity.caseStatusId, entity.number,
                                          entity.shared,entity.sharedDate,entity.caseId])
                      .then(()=>{
                        console.info('Executed SQL');
                           observer.next(true);
                           observer.complete();
                       }).catch(e=> {
                         console.log("Error updating:"+JSON.stringify(e));
                           observer.next(false);
                           observer.complete();
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

  public insert(entity: Cases){
       this.platform.ready().then(() => {
                this.sqlite = new SQLite();
                this.sqlite.create(DB_CONFIG).then((db) => {
                  let sql = 'INSERT INTO CASES (ID_CASE,ID_ELEMENT, ID_ELEMENT_TYPE, ID_CASE_STATUS, NR_CASE,FG_SHARED) '
                                              +'VALUES(?,?,?,?,?,?)';
                        //console.info("Objeto " + entity);
                  return db.executeSql(sql, [entity.caseId,entity.elementId, entity.elementTypeId,entity.caseStatusId,
                                      entity.number,0]);
                    }, (error) => {
                        console.info("Unable to execute sql " + JSON.stringify(error));
                    })
             }, (err) => {
                    console.info("Error opening database: " + err);
            });

    }

   public findByElement(elementId:number):any{
     let resList:Cases []=[];
     return new Promise((resolve,reject)=>{
          this.platform.ready().then(() => {
                this.sqlite = new SQLite();
                this.sqlite.create(DB_CONFIG).then((db) => {

                  let sql = 'SELECT ID_CASE,ID_ELEMENT, ID_ELEMENT_TYPE, ID_CASE_STATUS,NR_CASE,FG_SHARED,DT_SHARED '
                           +'FROM CASES WHERE ID_ELEMENT=?';
                    db.executeSql(sql, [elementId]).then(res => {
                      //console.info("Res query " + JSON.stringify(res)+"- elementId="+elementId);
                           for(var i =0; i< res.rows.length;i++){
                             let row=new Cases();
                             row.caseId=res.rows.item(i).ID_CASE;
                             row.caseStatusId=res.rows.item(i).ID_CASE_STATUS;
                             row.elementId=res.rows.item(i).ID_ELEMENT;
                             row.elementTypeId=res.rows.item(i).ID_ELEMENT_TYPE;
                             row.number=res.rows.item(i).NR_CASE;
                             row.shared=res.rows.item(i).FG_SHARED;
                             row.sharedDate=res.rows.item(i).DT_SHARED;
                             resList.push(row);
                           }
                         resolve(resList);
                     })
               }, (error) => {
                        console.info("Unable to execute sql " + JSON.stringify(error));
                        reject(error)
                    })
             }, (err) => {
                    console.info("Error opening database: " + err);
                    reject(err)
            });
     })
     }

     public findSharedCasesByElement(elementId:number):Observable<Cases []>{
       let resList:Cases []=[];
       return  Observable.create(observer=>{
           this.platform.ready().then(() => {
           this.sqlite = new SQLite();
           this.sqlite.create(DB_CONFIG).then((db:SQLiteObject) => {

             let sql = 'SELECT ID_CASE,ID_ELEMENT, ID_ELEMENT_TYPE, ID_CASE_STATUS,NR_CASE,FG_SHARED,DT_SHARED '
                      +'FROM CASES WHERE FG_SHARED=1 AND ID_ELEMENT='+elementId;
                 //console.info("SharedCases query " + sql);
               db.executeSql(sql, []).then(res => {
                 //console.info("Res query " + JSON.stringify(res)+"- elementId="+elementId);
                      for(var i =0; i< res.rows.length;i++){
                            let row=new Cases();
                            row.caseId=res.rows.item(i).ID_CASE;
                            row.caseStatusId=res.rows.item(i).ID_CASE_STATUS;
                            row.elementId=res.rows.item(i).ID_ELEMENT;
                            row.elementTypeId=res.rows.item(i).ID_ELEMENT_TYPE;
                            row.number=res.rows.item(i).NR_CASE;
                            row.shared=res.rows.item(i).FG_SHARED;
                            row.sharedDate=res.rows.item(i).DT_SHARED;
                            resList.push(row);

                          }
                            observer.next(resList);
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
