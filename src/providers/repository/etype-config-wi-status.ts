import { Injectable } from '@angular/core';
import { SQLite, SQLiteObject } from '@ionic-native/sqlite';
import { ComboValue} from '../../app/clases/entities/combo-value';
import { WiElementAttribute} from '../../app/clases/entities/wi-element-attribute';
import { Platform } from 'ionic-angular';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { DB_CONFIG} from '../../config/app-constants';
import { Observable } from 'rxjs';

@Injectable()
export class EtypeConfigWiStatusRepository {

public sqlite: SQLite;

db: SQLiteObject = null;
constructor(private platform:Platform) {

}

public insert(entity: ComboValue):Observable<boolean>{
      console.log("Inser ComboValue")
    return  Observable.create(observer=>{
         this.platform.ready().then(() => {
         this.sqlite = new SQLite();
         this.sqlite.create(DB_CONFIG).then((db:SQLiteObject) => {
                let sql = 'INSERT INTO COMBO_VALUE (ID_COMBO_VALUE,ID_COMBO_CATEGORY, NM_LABEL,NM_VALUE) VALUES(?,?,?,?)';
                      db.executeSql(sql, [entity.comboValueId,entity.comboCategoryId,entity.label,entity.value])
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

  public update(entity: ComboValue):Observable<boolean>{
      return Observable.create(observer=>{
        this.platform.ready().then(() => {
                 this.sqlite = new SQLite();
                 this.sqlite.create(DB_CONFIG).then((db) => {
                     let sql = 'UPDATE COMBO_VALUE SET ID_COMBO_CATEGORY=?,NM_LABEL=?,NM_VALUE=? WHERE ID_COMBO_VALUE=?';
                     //  console.info("going to insert etype:"+JSON.stringify(entity));

                           db.executeSql(sql, [entity.comboCategoryId,entity.label, entity.value])
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

   public findByComboCategoryId(comboCategoryId:number):Observable<ComboValue[]>{
     let comboValue:ComboValue =null;
     return  Observable.create(observer=>{
         this.platform.ready().then(() => {
         this.sqlite = new SQLite();
         this.sqlite.create(DB_CONFIG).then((db:SQLiteObject) => {

                  let sql = 'SELECT ID_COMBO_VALUE,ID_COMBO_CATEGORY, NM_LABEL,NM_VALUE FROM COMBO_VALUE WHERE ID_COMBO_CATEGORY='+ comboCategoryId;
                    db.executeSql(sql, {}).then(res => {
                       //console.info('Executed SQL'+JSON.stringify(res)+'-caseId'+caseId);
                           if(res.rows.length>0){
                             comboValue=new ComboValue();
                             comboValue.comboValueId=res.rows.item(0).ID_COMBO_VALUE;
                             comboValue.comboCategoryId=res.rows.item(0).ID_COMBO_CATEGORY;
                             comboValue.label=res.rows.item(0).NM_LABEL;
                             comboValue.value=res.rows.item(0).NM_VALUE;
                            }
                          observer.next(comboValue);
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

  public findComboValuesToWiElementbyComboCategory(wiAttribute:WiElementAttribute):Observable<WiElementAttribute>{
    let comboValue:ComboValue =null;
    wiAttribute.comboValue=[];
    return  Observable.create(observer=>{
        this.platform.ready().then(() => {
        this.sqlite = new SQLite();
        this.sqlite.create(DB_CONFIG).then((db:SQLiteObject) => {

                 let sql = 'SELECT ID_COMBO_VALUE,ID_COMBO_CATEGORY, NM_LABEL,NM_VALUE FROM COMBO_VALUE WHERE ID_COMBO_CATEGORY='+ wiAttribute.attribute.comboCategoryId;
                   db.executeSql(sql, {}).then(res => {
                      //console.info('Executed SQL'+JSON.stringify(res)+'-caseId'+caseId);
                          for(var i =0; i< res.rows.length;i++){
                            comboValue=new ComboValue();
                            comboValue.comboValueId=res.rows.item(i).ID_COMBO_VALUE;
                            comboValue.comboCategoryId=res.rows.item(i).ID_COMBO_CATEGORY;
                            comboValue.label=res.rows.item(i).NM_LABEL;
                            comboValue.value=res.rows.item(i).NM_VALUE;
                            comboValue.valueString=''+comboValue.value;
                            wiAttribute.comboValue.push(comboValue);
                           }
                         observer.next(wiAttribute);
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
