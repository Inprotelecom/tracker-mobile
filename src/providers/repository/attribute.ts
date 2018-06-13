import { Injectable } from '@angular/core';
import { SQLite, SQLiteObject } from '@ionic-native/sqlite';
import { Attribute} from '../../app/clases/entities/attribute';
import { Platform } from 'ionic-angular';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { DB_CONFIG} from '../../config/app-constants';
import { Observable } from 'rxjs';
import { UNIQUE_CONSTRAINT_FAILED_CODE} from '../../config/sqlite-error-constants';

@Injectable()
export class AttributeRepository {

public sqlite: SQLite;

db: SQLiteObject = null;
constructor(private platform:Platform) {

}

public insert(entity: Attribute):Observable<boolean>{
      console.log("Inser attribute")
    return  Observable.create(observer=>{
         this.platform.ready().then(() => {
         this.sqlite = new SQLite();
         this.sqlite.create(DB_CONFIG).then((db:SQLiteObject) => {
                let sql = 'INSERT INTO ATTRIBUTE (ID_ATTRIBUTE, NM_ATTRIBUTE, CD_ATTRIBUTE,VL_ATTRIBUTE_SIZE, ID_COMBO_CATEGORY,ID_ATTRIBUTE_TYPE,NM_ATTRIBUTE_TYPE,'
                          +'VL_ATTRIBUTE_TYPE,NM_WEB_COMPONENT) VALUES(?,?,?,?,?,?,?,?,?)';
                      db.executeSql(sql, [entity.attributeId,entity.name, entity.code,entity.sizeAttribute,entity.comboCategoryId,
                                    entity.attributeTypeId,entity.attributeTypeName,entity.attributeTypeJavaType,entity.attributeTypeWebComponent])
                      .then(()=>{
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
                           console.log("Observable resp error:"+message);
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

  public update(entity: Attribute):Observable<boolean>{
      return Observable.create(observer=>{
        this.platform.ready().then(() => {
                 this.sqlite = new SQLite();
                 this.sqlite.create(DB_CONFIG).then((db) => {
                     let sql = 'UPDATE ATTRIBUTE SET NM_ATTRIBUTE=?, CD_ATTRIBUTE=?,VL_ATTRIBUTE_SIZE=?, ID_COMBO_CATEGORY=?,ID_ATTRIBUTE_TYPE=?,NM_ATTRIBUTE_TYPE=?,'
                     +        'VL_ATTRIBUTE_TYPE=?,NM_WEB_COMPONENT=? WHERE ID_ATTRIBUTE=?';
                     //  console.info("going to insert etype:"+JSON.stringify(entity));

                           db.executeSql(sql, [entity.name, entity.code,entity.sizeAttribute,entity.comboCategoryId,
                                         entity.attributeTypeId,entity.attributeTypeName,entity.attributeTypeJavaType,entity.attributeTypeWebComponent,entity.attributeId])
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

   public findById(attributeId:number):Observable<Attribute>{
     let attribute:Attribute =null;
     return  Observable.create(observer=>{
         this.platform.ready().then(() => {
         this.sqlite = new SQLite();
         this.sqlite.create(DB_CONFIG).then((db:SQLiteObject) => {

                  let sql = 'SELECT ID_ATTRIBUTE, NM_ATTRIBUTE, CD_ATTRIBUTE,VL_ATTRIBUTE_SIZE, ID_COMBO_CATEGORY,ID_ATTRIBUTE_TYPE,NM_ATTRIBUTE_TYPE, '
                           +'VL_ATTRIBUTE_TYPE,NM_WEB_COMPONENT FROM ATTRIBUTE WHERE ID_ATTRIBUTE='+ attributeId;
                    db.executeSql(sql, {}).then(res => {
                       //console.info('Executed SQL'+JSON.stringify(res)+'-caseId'+caseId);
                           if(res.rows.length>0){
                             attribute=new Attribute();
                             attribute.attributeId=res.rows.item(0).ID_ATTRIBUTE;
                             attribute.code=res.rows.item(0).CD_ATTRIBUTE;
                             attribute.comboCategoryId=res.rows.item(0).ID_COMBO_CATEGORY;
                             attribute.attributeTypeId=res.rows.item(0).ID_ATTRIBUTE_TYPE;
                             attribute.attributeTypeName=res.rows.item(0).NM_ATTRIBUTE_TYPE;
                             attribute.attributeTypeJavaType=res.rows.item(0).VL_ATTRIBUTE_TYPE;
                             attribute.attributeTypeWebComponent=res.rows.item(0).NM_WEB_COMPONENT;

                           }
                          observer.next(attribute);
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
