import { Injectable } from '@angular/core';
import { SQLite, SQLiteObject } from '@ionic-native/sqlite';
import { WorkItemElementDocStructure} from '../../app/clases/entities/wi-element-doc-structure';
import { Platform } from 'ionic-angular';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { DB_CONFIG} from '../../config/app-constants';
import { Observable } from 'rxjs';
import { UNIQUE_CONSTRAINT_FAILED_CODE} from '../../config/sqlite-error-constants';

@Injectable()
export class WiElementDocStructureRepository {

public sqlite: SQLite;

db: SQLiteObject = null;
constructor(private platform:Platform) {

}

public insert(entity: WorkItemElementDocStructure):Observable<boolean>{
      console.log("Inser WI")
    return  Observable.create(observer=>{
         this.platform.ready().then(() => {
         this.sqlite = new SQLite();
         this.sqlite.create(DB_CONFIG).then((db:SQLiteObject) => {
                 let sql = 'INSERT INTO WI_ELEMENT_DOC_STRUCTURE (ID_WORK_ITEM_ELEMENT, ID_ELEMENT_TYPE_CONFIG, VL_DOCUMENT_STRUCTURE) '
                          +'VALUES(?,?,?)';
                      db.executeSql(sql, [entity.workitemElementId,entity.elementTypeConfigId,
                        entity.structure])
                      .then(()=>{
                        console.info('Executed SQL');
                        observer.next(true);
                        observer.complete();
                       }).catch(e=> {
                         console.log("Error inserting 1:"+JSON.stringify(e)+"-"+e.message.toUpperCase());
                         let message:string=e.message.toUpperCase();
                         //message=message.toUpperCase();
                           this.update(entity).subscribe(resp=>{
                             console.log("Observable resp update:"+resp);
                           });
                           observer.next(true);
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

  public update(entity: WorkItemElementDocStructure):Observable<boolean>{
      return Observable.create(observer=>{
        this.platform.ready().then(() => {
                 this.sqlite = new SQLite();
                 this.sqlite.create(DB_CONFIG).then((db) => {
                     let sql = 'UPDATE WI_ELEMENT_DOC_STRUCTURE SET VL_DOCUMENT_STRUCTURE=? WHERE ID_WORK_ITEM_ELEMENT=? AND ID_ELEMENT_TYPE_CONFIG=?';
                           db.executeSql(sql, [entity.structure,entity.workitemElementId,entity.elementTypeConfigId])
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

 public findByWiElementAndElementTypeConfig(wiElement:number,elementTypeConfigId:number):Observable<WorkItemElementDocStructure>{
     let row=new WorkItemElementDocStructure();
     return  Observable.create(observer=>{
         this.platform.ready().then(() => {
         this.sqlite = new SQLite();
         this.sqlite.create(DB_CONFIG).then((db:SQLiteObject) => {
                  let sql = 'SELECT ID_WORK_ITEM_ELEMENT, ID_ELEMENT_TYPE_CONFIG, VL_DOCUMENT_STRUCTURE '
                           +' FROM WI_ELEMENT_DOC_STRUCTURE '
                           +' WHERE ID_WORK_ITEM_ELEMENT='+wiElement
                           +' AND ID_ELEMENT_TYPE_CONFIG='+elementTypeConfigId;
                       //console.info('Query info WiElementAttribute'+sql);
                      // console.log('WorkItemElementDocStructure query:'+sql);
                    db.executeSql(sql, {}).then(res => {
                        console.log('WorkItemElementDocStructure query:'+sql);
                           for(var i =0; i< res.rows.length;i++){
                             //console.info('Executed SQL WorkItemElementDocStructure'+JSON.stringify(res.rows.item(i)));
                             row=new WorkItemElementDocStructure();
                             row.elementTypeConfigId=res.rows.item(i).ID_ELEMENT_TYPE_CONFIG;
                             row.workitemElementId=res.rows.item(i).ID_WORK_ITEM_ELEMENT;
                             row.structure=res.rows.item(i).VL_DOCUMENT_STRUCTURE;
                             row.structureObject=JSON.parse(row.structure);
                           }
                          observer.next(row);
                          observer.complete();
                       }).catch(e=>{
                     console.error("Error cquerying:"+e);
                     observer.next(row);
                     observer.complete();
                   });

            }).catch(e => {
                   console.error("Error opening database: " + JSON.stringify(e));
                   observer.next(row);
                   observer.complete();
           });

           });

     })
  }

}
