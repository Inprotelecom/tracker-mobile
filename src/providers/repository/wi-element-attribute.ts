import { Injectable } from '@angular/core';
import { SQLite, SQLiteObject } from '@ionic-native/sqlite';
import { WiElementAttribute} from '../../app/clases/entities/wi-element-attribute';
import { Attribute} from '../../app/clases/entities/attribute';
import { Platform } from 'ionic-angular';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { DB_CONFIG} from '../../config/app-constants';
import { Observable } from 'rxjs';
import { UNIQUE_CONSTRAINT_FAILED_CODE} from '../../config/sqlite-error-constants';

@Injectable()
export class WiElementAttributeRepository {

public sqlite: SQLite;

db: SQLiteObject = null;
constructor(private platform:Platform) {

}

public insert(entity: WiElementAttribute):Observable<boolean>{
      console.log("Inser WI")
    return  Observable.create(observer=>{
         this.platform.ready().then(() => {
         this.sqlite = new SQLite();
         this.sqlite.create(DB_CONFIG).then((db:SQLiteObject) => {
             if(entity.wiElementAttributeId==null){
               let localId:string=''+entity.attributeId+new Date().getTime();
               entity.wiElementAttributeId=parseInt(localId)*-1;
              }
              let sql = 'INSERT INTO WI_ELEMENT_ATTRIBUTE (ID_WI_ELEMENT_ATTRIBUTE, ID_ATTRIBUTE, VL_ATTRIBUTE,ID_WORK_ITEM_ELEMENT,FG_SYNCED) '
                          +'VALUES(?,?,?,?,?)';
                      db.executeSql(sql, [entity.wiElementAttributeId,entity.attributeId,
                        entity.value,entity.workitemElementId,entity.synced?1:0])
                      .then(()=>{
                        //console.info('Executed SQL');
                        observer.next(true);
                        observer.complete();
                       }).catch(e=> {
                         console.log("Error inserting 1:"+JSON.stringify(e));
                         let message:string=e.message;
                         message=message.toUpperCase();
                         if(message.indexOf(UNIQUE_CONSTRAINT_FAILED_CODE) != -1){
                           console.log(UNIQUE_CONSTRAINT_FAILED_CODE);
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

  public update(entity: WiElementAttribute):Observable<boolean>{
      return Observable.create(observer=>{
        this.platform.ready().then(() => {
                 this.sqlite = new SQLite();
                 this.sqlite.create(DB_CONFIG).then((db) => {
                     let sql = 'UPDATE WI_ELEMENT_ATTRIBUTE SET ID_WI_ELEMENT_ATTRIBUTE=?, VL_ATTRIBUTE=?, FG_SYNCED=? WHERE ID_ATTRIBUTE=? AND ID_WORK_ITEM_ELEMENT=?';
                           db.executeSql(sql, [entity.wiElementAttributeId,entity.value,(entity.synced)?1:0,entity.attributeId,
                             entity.workitemElementId])
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

 public findWorkitemElementId(wiElement:number):Observable<WiElementAttribute[]>{
     let resList:WiElementAttribute []=[];
     return  Observable.create(observer=>{
         this.platform.ready().then(() => {
         this.sqlite = new SQLite();
         this.sqlite.create(DB_CONFIG).then((db:SQLiteObject) => {

                  let sql = 'SELECT WA.ID_WI_ELEMENT_ATTRIBUTE, E.ID_ATTRIBUTE, WA.VL_ATTRIBUTE,W.ID_WORK_ITEM_ELEMENT,WA.FG_SYNCED,'
                            +'A.ID_ATTRIBUTE_TYPE,A.VL_ATTRIBUTE_TYPE,A.NM_WEB_COMPONENT,A.NM_ATTRIBUTE,A.ID_COMBO_CATEGORY '
                            +'FROM ETYPE_CONFIG_ATTRIBUTE E JOIN WORKITEM_ELEMENT W '
                            +'ON E.ID_ELEMENT_TYPE_CONFIG=W.ID_ELEMENT_TYPE_CONFIG '
                            +'JOIN ATTRIBUTE A '
                            +'ON A.ID_ATTRIBUTE=E.ID_ATTRIBUTE '
                            +'LEFT JOIN WI_ELEMENT_ATTRIBUTE WA '
                            +'ON WA.ID_WORK_ITEM_ELEMENT=W.ID_WORK_ITEM_ELEMENT '
                            +'AND WA.ID_ATTRIBUTE=A.ID_ATTRIBUTE '
                            +'WHERE W.ID_WORK_ITEM_ELEMENT='+wiElement;
                       //console.info('Query info WiElementAttribute'+sql);
                    db.executeSql(sql, {}).then(res => {
                          console.info('WiElementAttributes query:'+sql);
                           for(var i =0; i< res.rows.length;i++){
                             //console.info('Executed SQL WiElementAttribute'+JSON.stringify(res.rows.item(i)));
                             let row=new WiElementAttribute();
                             row.wiElementAttributeId=res.rows.item(i).ID_WI_ELEMENT_ATTRIBUTE;
                             row.attributeId=res.rows.item(i).ID_ATTRIBUTE;
                             row.value=res.rows.item(i).VL_ATTRIBUTE;
                             row.workitemElementId=res.rows.item(i).ID_WORK_ITEM_ELEMENT;
                             row.synced=(res.rows.item(i).FG_SYNCED)==1;
                             row.attribute=new Attribute();
                             row.attribute.attributeTypeId=res.rows.item(i).ID_ATTRIBUTE_TYPE;
                             row.attribute.attributeTypeJavaType=res.rows.item(i).VL_ATTRIBUTE_TYPE;
                             row.attribute.attributeTypeWebComponent=res.rows.item(i).NM_WEB_COMPONENT;
                             row.attribute.name=res.rows.item(i).NM_ATTRIBUTE;
                             row.attribute.comboCategoryId=res.rows.item(i).ID_COMBO_CATEGORY;
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


  public findWiAttributeByCaseIdAndSynced(caseId:number,synced:boolean):Observable<WiElementAttribute[]>{
      let resList:WiElementAttribute []=[];
      return  Observable.create(observer=>{
          this.platform.ready().then(() => {
          this.sqlite = new SQLite();
          this.sqlite.create(DB_CONFIG).then((db:SQLiteObject) => {

                   let sql = 'SELECT WA.ID_WI_ELEMENT_ATTRIBUTE, WA.ID_ATTRIBUTE, WA.VL_ATTRIBUTE,WA.ID_WORK_ITEM_ELEMENT,WA.FG_SYNCED '
                             +'FROM WORKITEM_ELEMENT W JOIN WI_ELEMENT_ATTRIBUTE WA '
                             +'ON W.ID_WORK_ITEM_ELEMENT=WA.ID_WORK_ITEM_ELEMENT '
                             +'WHERE W.ID_CASE='+caseId
                             +' AND WA.FG_SYNCED='+(synced?1:0);
                        //console.info('Query info WiElementAttribute'+sql);
                     db.executeSql(sql, {}).then(res => {
                           //console.info('WiElementAttributes query:'+sql);
                            for(var i =0; i< res.rows.length;i++){
                              //console.info('Executed SQL WiElementAttribute'+JSON.stringify(res.rows.item(i)));
                              let row=new WiElementAttribute();
                              row.wiElementAttributeId=res.rows.item(i).ID_WI_ELEMENT_ATTRIBUTE;
                              row.attributeId=res.rows.item(i).ID_ATTRIBUTE;
                              row.value=res.rows.item(i).VL_ATTRIBUTE;
                              row.workitemElementId=res.rows.item(i).ID_WORK_ITEM_ELEMENT;
                              row.synced=(res.rows.item(i).FG_SYNCED)==1;
                              resList.push(row);
                            }
                           observer.next(resList);
                           observer.complete();
                        }).catch(e=>{
                      console.error("Error querying WiElementAttributes:"+JSON.stringify(e));
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
