import { Injectable } from '@angular/core';
import { SQLite, SQLiteObject } from '@ionic-native/sqlite';
import { WiElementAttribute} from '../../app/clases/entities/wi-element-attribute';
import { Attribute} from '../../app/clases/entities/attribute';
import { Platform } from 'ionic-angular';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { DB_CONFIG} from '../../config/app-constants';
import { Observable } from 'rxjs';

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
                let sql = 'INSERT INTO WI_ELEMENT_ATTRIBUTE (ID_WI_ELEMENT_ATTRIBUTE, ID_ATTRIBUTE, VL_ATTRIBUTE,ID_WORK_ITEM_ELEMENT) '
                          +'VALUES(?,?,?,?)';
                      db.executeSql(sql, [entity.wiElementAttributeId,entity.attributeId, entity.value,entity.workitemElementId])
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

  public update(entity: WiElementAttribute):Observable<boolean>{
      return Observable.create(observer=>{
        this.platform.ready().then(() => {
                 this.sqlite = new SQLite();
                 this.sqlite.create(DB_CONFIG).then((db) => {
                     let sql = 'UPDATE WI_ELEMENT_ATTRIBUTE SET ID_WI_ELEMENT_ATTRIBUTE=?, VL_ATTRIBUTE=? WHERE ID_ATTRIBUTE=? AND ID_WORK_ITEM_ELEMENT=?';
                           db.executeSql(sql, [entity.wiElementAttributeId,entity.value,entity.attributeId, entity.workitemElementId])
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

                  let sql = 'SELECT WA.ID_WI_ELEMENT_ATTRIBUTE, E.ID_ATTRIBUTE, WA.VL_ATTRIBUTE,W.ID_WORK_ITEM_ELEMENT,'
                            +'A.ID_ATTRIBUTE_TYPE,A.VL_ATTRIBUTE_TYPE,A.NM_WEB_COMPONENT,A.NM_ATTRIBUTE '
                            +'FROM ETYPE_CONFIG_ATTRIBUTE E JOIN WORKITEM_ELEMENT W '
                            +'ON E.ID_ELEMENT_TYPE_CONFIG=W.ID_ELEMENT_TYPE_CONFIG '
                            +'JOIN ATTRIBUTE A '
                            +'ON A.ID_ATTRIBUTE=E.ID_ATTRIBUTE '
                            +'LEFT JOIN WI_ELEMENT_ATTRIBUTE WA '
                            +'ON WA.ID_WORK_ITEM_ELEMENT=W.ID_WORK_ITEM_ELEMENT '
                            +'WHERE W.ID_WORK_ITEM_ELEMENT='+wiElement;
                       //console.info('Query info WiElementAttribute'+sql);
                    db.executeSql(sql, {}).then(res => {

                           for(var i =0; i< res.rows.length;i++){
                             console.info('Executed SQL WiElementAttribute'+JSON.stringify(res.rows.item(i)));
                             let row=new WiElementAttribute();
                             row.wiElementAttributeId=res.rows.item(i).ID_WI_ELEMENT_ATTRIBUTE;
                             row.attributeId=res.rows.item(i).ID_ATTRIBUTE;
                             row.value=res.rows.item(i).VL_ATTRIBUTE;
                             row.workitemElementId=res.rows.item(i).ID_WORK_ITEM_ELEMENT;
                             row.attribute=new Attribute();
                             row.attribute.attributeTypeId=res.rows.item(i).ID_ATTRIBUTE_TYPE;
                             row.attribute.attributeTypeJavaType=res.rows.item(i).VL_ATTRIBUTE_TYPE;
                             row.attribute.attributeTypeWebComponent=res.rows.item(i).NM_WEB_COMPONENT;
                             row.attribute.name=res.rows.item(i).NM_ATTRIBUTE;
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
