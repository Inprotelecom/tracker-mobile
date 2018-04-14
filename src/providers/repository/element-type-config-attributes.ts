import { Injectable } from '@angular/core';
import { SQLite, SQLiteObject } from '@ionic-native/sqlite';
import { ElementTypeConfigAttribute } from '../../app/clases/entities/element-type-config-attributes';
import { Platform } from 'ionic-angular';
import { DB_CONFIG} from '../../config/app-constants';
import { Observable } from 'rxjs';


@Injectable()
export class ElementTypeConfigAttributeRepository {

  public sqlite: SQLite;

  db: SQLiteObject = null;
  constructor(private platform:Platform) {

  }

  public insert(entity: ElementTypeConfigAttribute):Observable<boolean>{
    return Observable.create(observer=>{
       this.platform.ready().then(() => {
                this.sqlite = new SQLite();
                this.sqlite.create(DB_CONFIG).then((db) => {
                    let sql = 'INSERT INTO ETYPE_CONFIG_ATTRIBUTE (ID_ATTRIBUTE, ID_ELEMENT_TYPE_CONFIG, ID_ATTRIBUTE_TYPE,ID_COMBO_CATEGORY,FG_MANDATORY) VALUES (?,?,?,?,?)';
                    //  console.info("going to insert etype:"+JSON.stringify(entity));

                          db.executeSql(sql, [entity.attributeId,entity.elementTypeConfigId, entity.attributeTypeId,entity.comboCategoryId,entity.mandatory])
                          .then(res=>{
                            //console.log('Executed SQL');
                            observer.next(true);
                            observer.complete();
                          }).catch(e=>{
                               //console.log("Error inserting 1:"+JSON.stringify(e));
                               let message:string=e.message;
                               message=message.toUpperCase();
                               if((message.indexOf("UNIQUE CONSTRAINT FAILED"))){
                                 //console.log("UNIQUE CONSTRAINT FAILED");

                                  this.update(entity).subscribe(resp=>{
                                    //console.log("Observable resp update:"+resp);
                                  });
                                  observer.next(true);
                                  observer.complete();

                               }else{
                                 observer.next(false);
                                 observer.complete();
                               }

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

    public delete(entity: ElementTypeConfigAttribute):Observable<boolean>{
      return Observable.create(observer=>{
         this.platform.ready().then(() => {
                  this.sqlite = new SQLite();
                  this.sqlite.create(DB_CONFIG).then((db) => {
                      let sql = 'DELETE FROM ETYPE_CONFIG_ATTRIBUTE WHERE ID_ATTRIBUTE=? AND ID_ELEMENT_TYPE_CONFIG=?';
                            db.executeSql(sql, [entity.attributeId,entity.elementTypeConfigId])
                            .then(res=>{
                              console.log('Executed SQL');
                              observer.next(true);
                              observer.complete();
                            }).catch(e=>{
                              console.log("Error deleting:"+JSON.stringify(e));
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

    public update(entity: ElementTypeConfigAttribute):Observable<boolean>{
        return Observable.create(observer=>{
          this.platform.ready().then(() => {
                   this.sqlite = new SQLite();
                   this.sqlite.create(DB_CONFIG).then((db) => {
                       let sql = 'UPDATE ETYPE_CONFIG_ATTRIBUTE SET ID_ATTRIBUTE_TYPE=?,ID_COMBO_CATEGORY=?,FG_MANDATORY=? WHERE ID_ATTRIBUTE=? AND ID_ELEMENT_TYPE_CONFIG=?';
                       //  console.info("going to insert etype:"+JSON.stringify(entity));

                             db.executeSql(sql, [entity.attributeTypeId,entity.comboCategoryId,entity.mandatory,entity.attributeId,entity.elementTypeConfigId])
                             .then(res=>{
                               //console.log('Executed SQL update');
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
