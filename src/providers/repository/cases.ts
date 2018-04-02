import { Injectable } from '@angular/core';
import { SQLite, SQLiteObject } from '@ionic-native/sqlite';
import { Cases} from '../../app/clases/entities/cases';
import { Platform } from 'ionic-angular';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { DB_CONFIG} from '../../config/app-constants';

@Injectable()
export class CasesRepository {

  public sqlite: SQLite;

  db: SQLiteObject = null;
  private dbReady = new BehaviorSubject<boolean>(false);
  constructor(private platform:Platform) {

  }

  public insert(entity: Cases){
       this.platform.ready().then(() => {
                this.sqlite = new SQLite();
                this.sqlite.create(DB_CONFIG).then((db) => {
                  let sql = 'INSERT INTO CASES (ID_CASE,ID_ELEMENT, ID_ELEMENT_TYPE, ID_CASE_STATUS, NR_CASE) '
                                              +'VALUES(?,?,?,?,?)';
                        //console.info("Objeto " + entity);
                  return db.executeSql(sql, [entity.caseId,entity.elementId, entity.elementTypeId,entity.caseStatusId,
                                      entity.number]);
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

                  let sql = 'SELECT ID_CASE,ID_ELEMENT, ID_ELEMENT_TYPE, ID_CASE_STATUS,NR_CASE '
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


}
