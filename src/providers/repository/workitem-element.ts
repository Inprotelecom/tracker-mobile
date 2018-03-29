import { Injectable } from '@angular/core';
import { SQLite, SQLiteObject } from '@ionic-native/sqlite';
import { WorkitemElement} from '../../app/clases/entities/workitem-element';
import { Platform } from 'ionic-angular';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { DB_CONFIG} from '../../config/app-constants';

@Injectable()
export class WorkItemElementRepository {

  public sqlite: SQLite;

  db: SQLiteObject = null;
  private dbReady = new BehaviorSubject<boolean>(false);
  constructor(private platform:Platform) {

  }

  public insert(entity: WorkitemElement){
        console.log("Inser WI")

       this.platform.ready().then(() => {
                this.sqlite = new SQLite();
                this.sqlite.create(DB_CONFIG).then((db) => {
                  let sql = 'INSERT INTO WORKITEM_ELEMENT (ID_WORK_ITEM_ELEMENT, ID_ELEMENT, ID_CASE,ID_ELEMENT_TYPE_CONFIG, ID_WORK_ITEM_STATUS,ID_PARENT,NR_ORDER,NR_SEQUENCIAL,'
                            +'NM_WORKITEM_TEMPLATE,NM_WORKITEM_STATUS,DE_NOTES) VALUES(?,?,?,?,?,?,?,?,?,?,?)';
                      //  console.info("Objeto " + entity);
                  return db.executeSql(sql, [entity.workitemElementId,entity.elementId, entity.caseId,entity.elementTypeConfigId,entity.workItemStatusId,
                                      entity.parent,entity.order,entity.sequencial,entity.workitemTemplate,entity.notes]);
                    }, (error) => {
                        console.info("Unable to execute sql " + JSON.stringify(error));
                    })
             }, (err) => {
                    console.info("Error opening database: " + err);
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
                           +'FROM PROJECT_SUBPROJECT';
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


}
