import { Injectable } from '@angular/core';
import { SQLite, SQLiteObject } from '@ionic-native/sqlite';
import { WiElementAttribute} from '../../app/clases/entities/wi-element-attribute';
import { Attribute} from '../../app/clases/entities/attribute';
import { Platform } from 'ionic-angular';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { DB_CONFIG} from '../../config/app-constants';
import { Observable } from 'rxjs';
import {WiElementAttachment} from "../../app/clases/entities/wi-element-attachment";

@Injectable()
export class WiElementAttachmentRepository {

public sqlite: SQLite;

db: SQLiteObject = null;
constructor(private platform:Platform) {

}

public insert(entity: WiElementAttachment):Observable<boolean>{
      console.log("Insert Attachment")
    return  Observable.create(observer=>{
         this.platform.ready().then(() => {
         this.sqlite = new SQLite();
         this.sqlite.create(DB_CONFIG).then((db:SQLiteObject) => {
             if(entity.wiElementAttachmentId==null){
               let localId:string=''+entity.etypeConfigDocId+new Date().getTime();
               entity.wiElementAttachmentId=parseInt(localId)*-1;
              }
              let sql = 'INSERT INTO WI_ELEMENT_ATTACHMENT (ID_WI_ELEMENT_ATTACHMENT, ID_WORK_ITEM_ELEMENT, ID_ELEMENT_TYPE_CONFIG_DOC,DE_WI_ELEMENT_ATTACHMENT,VL_FILE_B64,FG_SYNCED,VL_TYPE) '
                          +'VALUES(?,?,?,?,?,?,?)';
                      db.executeSql(sql, [entity.wiElementAttachmentId,entity.workitemElementId,
                        entity.etypeConfigDocId,entity.comments,entity.file,entity.synced?1:0,entity.type])
                      .then(()=>{
                          console.info('Executed SQL');
                          observer.next(true);
                          observer.complete();
                       }).catch(e=> {
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

  public updateSyncedAndWiElementAttachmentId(wiElementAttachmentIdLocal:number,
                                              wiElementAttachmentIdRemote:number,
                                              synced:boolean):Observable<boolean>{
      return Observable.create(observer=>{
        this.platform.ready().then(() => {
                 this.sqlite = new SQLite();
                 this.sqlite.create(DB_CONFIG).then((db) => {
                     let sql = 'UPDATE WI_ELEMENT_ATTACHMENT SET ID_WI_ELEMENT_ATTACHMENT=?, FG_SYNCED=? WHERE ID_WI_ELEMENT_ATTACHMENT='+wiElementAttachmentIdLocal;
                         console.log('Wi Attachment:'+sql);
                         db.executeSql(sql, [wiElementAttachmentIdRemote,(synced)?1:0])
                           .then(res=>{
                             observer.next(true);
                             observer.complete();
                           }).catch(e=>{
                                  console.error('Error updating:'+e);
                                  observer.next(false);
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

  public findWiElementAttachmentByWiElementIdAndEtypeConfigDocIdAndSynced(
    wiElementId:number,etypeConfigDocId:number,synced:boolean):Observable<WiElementAttachment[]>{
      let resList:WiElementAttachment []=[];
      let row=new WiElementAttachment();
      return  Observable.create(observer=>{
          this.platform.ready().then(() => {
          this.sqlite = new SQLite();
          this.sqlite.create(DB_CONFIG).then((db:SQLiteObject) => {
            console.info('WiElementAttachment start:');
                   let sql = `SELECT  ID_WI_ELEMENT_ATTACHMENT, ID_WORK_ITEM_ELEMENT, ID_ELEMENT_TYPE_CONFIG_DOC,DE_WI_ELEMENT_ATTACHMENT,VL_FILE_B64,FG_SYNCED 
                             FROM WI_ELEMENT_ATTACHMENT 
                             WHERE ID_WORK_ITEM_ELEMENT=${wiElementId} 
                             AND FG_SYNCED=${(synced?1:0)} 
                             AND ID_ELEMENT_TYPE_CONFIG_DOC=${etypeConfigDocId}`;
                              console.info('WiElementAttachment query:'+sql);
                     db.executeSql(sql, {}).then(res => {
                           console.info('WiElementAttachment query:'+sql);
                            for(var i =0; i< res.rows.length;i++){
                              row=new WiElementAttachment();
                              row.wiElementAttachmentId=res.rows.item(i).ID_WI_ELEMENT_ATTACHMENT;
                              row.workitemElementId=res.rows.item(i).ID_WORK_ITEM_ELEMENT;
                              row.etypeConfigDocId=res.rows.item(i).ID_ELEMENT_TYPE_CONFIG_DOC;
                              row.comments=res.rows.item(i).DE_WI_ELEMENT_ATTACHMENT;
                              row.file=res.rows.item(i).VL_FILE_B64;
                              row.synced=(res.rows.item(i).FG_SYNCED)==1;
                              resList.push(row);
                            }
                           observer.next(resList);
                           observer.complete();
                        }).catch(e=>{
                      console.error("Error querying WiElementAttachment:"+JSON.stringify(e));
                      observer.next(resList);
                      observer.complete();
                    });

             }).catch(e => {
                    console.error("Error opening database: " + JSON.stringify(e));
                    observer.next(resList);
                    observer.complete();
            });

            });

      })
   }

  public findWiElementAttachmentByNotSyncedByCaseId(caseId:number):Observable<WiElementAttachment[]>{
    let resList:WiElementAttachment []=[];
    let row=new WiElementAttachment();
    return  Observable.create(observer=>{
      this.platform.ready().then(() => {
        this.sqlite = new SQLite();
        this.sqlite.create(DB_CONFIG).then((db:SQLiteObject) => {

          let sql = 'SELECT  WA.ID_WI_ELEMENT_ATTACHMENT, WA.ID_WORK_ITEM_ELEMENT, WA.ID_ELEMENT_TYPE_CONFIG_DOC,WA.DE_WI_ELEMENT_ATTACHMENT,VL_FILE_B64,WA.FG_SYNCED,WA.VL_TYPE '
            +' FROM WI_ELEMENT_ATTACHMENT WA '
            +' JOIN WORKITEM_ELEMENT WI ON WI.ID_WORK_ITEM_ELEMENT=WA.ID_WORK_ITEM_ELEMENT '
            +' WHERE WI.ID_CASE='+caseId
            +' AND WA.FG_SYNCED=0';
          console.info('WiElementAttachment query:'+sql);
          db.executeSql(sql, {}).then(res => {
            console.info('WiElementAttachment query:'+sql);
            for(var i =0; i< res.rows.length;i++){
              row=new WiElementAttachment();
              row.wiElementAttachmentId=res.rows.item(i).ID_WI_ELEMENT_ATTACHMENT;
              row.workitemElementId=res.rows.item(i).ID_WORK_ITEM_ELEMENT;
              row.etypeConfigDocId=res.rows.item(i).ID_ELEMENT_TYPE_CONFIG_DOC;
              row.comments=res.rows.item(i).DE_WI_ELEMENT_ATTACHMENT;
              row.file=res.rows.item(i).VL_FILE_B64;
              row.synced=(res.rows.item(i).FG_SYNCED)==1;
              row.type=res.rows.item(i).VL_TYPE;
              resList.push(row);
            }
            observer.next(resList);
            observer.complete();
          }).catch(e=>{
            console.error("Error querying:"+JSON.stringify(e));
            observer.next(resList);
            observer.complete();
          });

        }).catch(e => {
          console.error("Error opening database: " + JSON.stringify(e));
          observer.next(resList);
          observer.complete();
        });

      });

    })
  }



}
