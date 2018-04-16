import { Injectable } from '@angular/core';
import { SQLite, SQLiteObject } from '@ionic-native/sqlite';
import { WorkitemElement} from '../../app/clases/entities/workitem-element';
import { Platform } from 'ionic-angular';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { DB_CONFIG} from '../../config/app-constants';
import { Observable } from 'rxjs';

@Injectable()
export class WorkItemElementRepository {

public sqlite: SQLite;

db: SQLiteObject = null;
constructor(private platform:Platform) {

}

public insert(entity: WorkitemElement):Observable<boolean>{
      console.log("Inser WI")
    return  Observable.create(observer=>{
         this.platform.ready().then(() => {
         this.sqlite = new SQLite();
         this.sqlite.create(DB_CONFIG).then((db:SQLiteObject) => {
                let sql = 'INSERT INTO WORKITEM_ELEMENT (ID_WORK_ITEM_ELEMENT, ID_ELEMENT, ID_CASE,ID_ELEMENT_TYPE_CONFIG, ID_WORK_ITEM_STATUS,ID_PARENT,NR_ORDER,NR_SEQUENCIAL,'
                          +'NM_WORKITEM_TEMPLATE,NM_WORKITEM_STATUS,DE_NOTES) VALUES(?,?,?,?,?,?,?,?,?,?,?)';
                      db.executeSql(sql, [entity.workitemElementId,entity.elementId, entity.caseId,entity.elementTypeConfigId,entity.workItemStatusId,
                                    entity.parent,entity.order,entity.sequencial,entity.workitemTemplate,entity.notes])
                      .then(()=>{
                        //console.info('Executed SQL');
                        observer.next(true);
                        observer.complete();
                       }).catch(e=> {
                         //console.log("Error inserting 1:"+JSON.stringify(e));
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

  public deleteByCaseId(caseId: number):Observable<boolean>{
        console.log("Inser WI")
      return  Observable.create(observer=>{
           this.platform.ready().then(() => {
           this.sqlite = new SQLite();
           this.sqlite.create(DB_CONFIG).then((db:SQLiteObject) => {
                  let sql = 'DELETE FROM WORKITEM_ELEMENT WHERE ID_CASE=?';
                        db.executeSql(sql, [caseId])
                        .then(()=>{
                          //console.info('Executed SQL');
                          observer.next(true);
                          observer.complete();
                         }).catch(e=> {
                           console.log("Error DELETING:"+JSON.stringify(e));
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


  public update(entity: WorkitemElement):Observable<boolean>{
      return Observable.create(observer=>{
        this.platform.ready().then(() => {
                 this.sqlite = new SQLite();
                 this.sqlite.create(DB_CONFIG).then((db) => {
                     let sql = 'UPDATE WORKITEM_ELEMENT SET ID_ELEMENT=?, ID_CASE=?,ID_ELEMENT_TYPE_CONFIG=?, ID_WORK_ITEM_STATUS=?,ID_PARENT=?,NR_ORDER=?,'
                     +        'NR_SEQUENCIAL=?,NM_WORKITEM_TEMPLATE=?,NM_WORKITEM_STATUS=?,DE_NOTES=? WHERE ID_WORK_ITEM_ELEMENT='+entity.workitemElementId;
                     console.info("going to ipdate  WorkitemElement:"+JSON.stringify(entity));

                           db.executeSql(sql, [entity.elementId, entity.caseId,entity.elementTypeConfigId,entity.workItemStatusId,
                                         entity.parent,entity.order,entity.sequencial,entity.workitemTemplate,entity.workItemStatus,entity.notes])
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

  public updateStatusAndNotes(entity: WorkitemElement):Observable<boolean>{
    return Observable.create(observer=>{
      this.platform.ready().then(() => {
        this.sqlite = new SQLite();
        this.sqlite.create(DB_CONFIG).then((db) => {
          let sql = 'UPDATE WORKITEM_ELEMENT SET ID_WORK_ITEM_STATUS=?,DE_NOTES=? WHERE ID_WORK_ITEM_ELEMENT=?';
          console.info("going to ipdate  WorkitemElement:"+JSON.stringify(entity));

          db.executeSql(sql, [entity.workItemStatusId,entity.notes,entity.workitemElementId])
            .then(res=>{
              //console.log('Executed SQL wi update');
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

/* public update(entity: ProjectSubproject){
      let sql = 'UPDATE PROJECT_SUBPROJECT SET NM_PROJECT_OF=?, NM_SUBPROJECT=? WHERE ID=?';
      return this.db.executeSql(sql, [entity.projectName,entity.subprojectName]);
 }*/

 findByCaseId():any{
   let resList:WorkitemElement []=[];
   return new Promise((resolve,reject)=>{
        this.platform.ready().then(() => {
              this.sqlite = new SQLite();
              this.sqlite.create(DB_CONFIG).then((db) => {

                let sql = 'SELECT ID_WORK_ITEM_ELEMENT, ID_ELEMENT, ID_CASE,ID_ELEMENT_TYPE_CONFIG, ID_WORK_ITEM_STATUS,ID_PARENT,NR_ORDER,NR_SEQUENCIAL,NM_WORKITEM_TEMPLATE,NM_WORKITEM_STATUS,DE_NOTES '
                         +'FROM WORKITEM_ELEMENT';
                  db.executeSql(sql, {}).then(res => {
                     //console.log("query-item"+JSON.stringify(res));
                         for(var i =0; i< res.rows.length;i++){

                           let row=new WorkitemElement();
                           row.workitemElementId=res.rows.item(i).ID_WORK_ITEM_ELEMENT;
                           row.elementId=res.rows.item(i).ID_ELEMENT;
                           row.caseId=res.rows.item(i).ID_CASE;
                           row.elementTypeConfigId=res.rows.item(i).ID_ELEMENT_TYPE_CONFIG;
                           row.workItemStatusId=res.rows.item(i).ID_WORK_ITEM_STATUS;
                           row.parent=res.rows.item(i).ID_PARENT;
                           row.order=res.rows.item(i).NR_ORDER;
                           row.sequencial=res.rows.item(i).NR_SEQUENCIAL;
                           row.workitemTemplate=res.rows.item(i).NM_WORKITEM_TEMPLATE;
                           row.workItemStatus=res.rows.item(i).NM_WORKITEM_STATUS;
                           row.notes=res.rows.item(i).DE_NOTES;
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

  public findWiElementById(id:number):Observable<WorkitemElement>{
    let row:WorkitemElement=null
    return  Observable.create(observer=>{
      this.platform.ready().then(() => {
        this.sqlite = new SQLite();
        this.sqlite.create(DB_CONFIG).then((db:SQLiteObject) => {

          let sql = 'SELECT ID_WORK_ITEM_ELEMENT, ID_ELEMENT, ID_CASE,ID_ELEMENT_TYPE_CONFIG, ID_WORK_ITEM_STATUS,ID_PARENT,NR_ORDER,NR_SEQUENCIAL, '
            +'NM_WORKITEM_TEMPLATE,NM_WORKITEM_STATUS,DE_NOTES FROM WORKITEM_ELEMENT WHERE ID_WORK_ITEM_ELEMENT='+ id;

          db.executeSql(sql, {}).then(res => {
            if(res.rows.length>0){
              row=new WorkitemElement();
              row.workitemElementId=res.rows.item(0).ID_WORK_ITEM_ELEMENT;
              row.elementId=res.rows.item(0).ID_ELEMENT;
              row.elementTypeConfigId=res.rows.item(0).ID_ELEMENT_TYPE_CONFIG;
              row.workItemStatusId=res.rows.item(0).ID_WORK_ITEM_STATUS;
              row.parent=res.rows.item(0).ID_PARENT;
              row.sequencial=res.rows.item(0).NR_SEQUENCIAL;
              row.workitemTemplate=res.rows.item(0).NM_WORKITEM_TEMPLATE;
              row.workItemStatus=res.rows.item(0).NM_WORKITEM_STATUS;
              row.notes=res.rows.item(0).DE_NOTES;
            }
            observer.next(row);
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

   public findWiByCaseId(caseId:number):Observable<WorkitemElement []>{
     let resList:WorkitemElement []=[];
     return  Observable.create(observer=>{
         this.platform.ready().then(() => {
         this.sqlite = new SQLite();
         this.sqlite.create(DB_CONFIG).then((db:SQLiteObject) => {

                  let sql = 'SELECT ID_WORK_ITEM_ELEMENT, ID_ELEMENT, ID_CASE,ID_ELEMENT_TYPE_CONFIG, ID_WORK_ITEM_STATUS,ID_PARENT,NR_ORDER,NR_SEQUENCIAL, '
                           +'NM_WORKITEM_TEMPLATE,NM_WORKITEM_STATUS,DE_NOTES FROM WORKITEM_ELEMENT WHERE ID_CASE='+ caseId+' ORDER BY NR_SEQUENCIAL';
                    db.executeSql(sql, {}).then(res => {
                       console.info('Executed SQL'+JSON.stringify(res)+'-caseId'+caseId);
                           for(var i =0; i< res.rows.length;i++){
                             let row=new WorkitemElement();
                             row.workitemElementId=res.rows.item(i).ID_WORK_ITEM_ELEMENT;
                             row.elementId=res.rows.item(i).ID_ELEMENT;
                             row.elementTypeConfigId=res.rows.item(i).ID_ELEMENT_TYPE_CONFIG;
                             row.workItemStatusId=res.rows.item(i).ID_WORK_ITEM_STATUS;
                             row.parent=res.rows.item(i).ID_PARENT;
                             row.sequencial=res.rows.item(i).NR_SEQUENCIAL;
                             row.workitemTemplate=res.rows.item(i).NM_WORKITEM_TEMPLATE;
                             row.workItemStatus=res.rows.item(i).NM_WORKITEM_STATUS;
                             row.notes=res.rows.item(i).DE_NOTES;
                             resList.push(row);
                           }
                          observer.next(resList);
                          observer.complete();
                       }).catch(e=>{
                     console.error("Error querying WorkItemElementRepository:"+JSON.stringify(e));
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
