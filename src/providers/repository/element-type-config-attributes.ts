import { Injectable } from '@angular/core';
import { SQLite, SQLiteObject } from '@ionic-native/sqlite';
import { ElementTypeConfigAttribute } from '../../app/clases/entities/element-type-config-attributes';
import { Platform } from 'ionic-angular';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { DB_CONFIG} from '../../config/app-constants';


@Injectable()
export class ElementTypeConfigAttributeRepository {

  public sqlite: SQLite;

  db: SQLiteObject = null;
  private dbReady = new BehaviorSubject<boolean>(false);
  constructor(private platform:Platform) {

  }

  public insert(entity: ElementTypeConfigAttribute):Promise<boolean>{
    return  new Promise((resolve,reject)=>{
       this.platform.ready().then(() => {
                this.sqlite = new SQLite();
                this.sqlite.create(DB_CONFIG).then((db) => {
                  let sql = 'INSERT INTO ETYPE_CONFIG_ATTRIBUTE (ID_ATTRIBUTE, ID_ELEMENT_TYPE_CONFIG, ID_ATTRIBUTE_TYPE,ID_COMBO_CATEGORY,FG_MANDATORY VALUES (?,?,?,?,?)';
                  return db.executeSql(sql, [entity.attributeId,entity.elementTypeConfigId, entity.attributeTypeId,entity.comboCategoryId,entity.mandatory]).then(res=>{
                    resolve(true);
                  }).catch(error=>{
                    console.info("Error inserting: " + JSON.stringify(error));

                  })
                    }, (error) => {
                        console.info("Unable to execute sql " + JSON.stringify(error));


                    })
             }, (err) => {
                    console.info("Error opening database: " + err);


            });
            resolve(false);
            });
    }

  /* public update(entity: ProjectSubproject){
        let sql = 'UPDATE PROJECT_SUBPROJECT SET NM_PROJECT_OF=?, NM_SUBPROJECT=? WHERE ID=?';
        return this.db.executeSql(sql, [entity.projectName,entity.subprojectName]);
   }*/

   findByCaseId():any{
     let resList:ElementTypeConfigAttribute []=[];
     return new Promise((resolve,reject)=>{
          this.platform.ready().then(() => {
                this.sqlite = new SQLite();
                this.sqlite.create(DB_CONFIG).then((db) => {

                  let sql = 'SELECT ID_ATTRIBUTE, ID_ELEMENT_TYPE_CONFIG, FG_MANDATORY,ID_ATTRIBUTE_TYPE,ID_COMBO_CATEGORY '
                           +'FROM ETYPE_CONFIG_ATTRIBUTE';
                    db.executeSql(sql, {}).then(res => {
                       //console.log("query-item"+JSON.stringify(res));
                           for(var i =0; i< res.rows.length;i++){

                             let row=new ElementTypeConfigAttribute();
                             row.attributeId=res.rows.item(i).ID_ATTRIBUTE;
                             row.elementTypeConfigId=res.rows.item(i).ID_ELEMENT_TYPE_CONFIG;
                             row.mandatory=res.rows.item(i).FG_MANDATORY;
                             row.attributeTypeId=res.rows.item(i).ID_ATTRIBUTE_TYPE;
                             row.comboCategoryId=res.rows.item(i).ID_COMBO_CATEGORY;
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
