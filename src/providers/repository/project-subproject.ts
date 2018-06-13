import { Injectable } from '@angular/core';
import { SQLite, SQLiteObject } from '@ionic-native/sqlite';
import { ProjectSubproject} from '../../app/clases/entities/project-subproject';
import { Platform } from 'ionic-angular';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { DB_CONFIG} from '../../config/app-constants';
import { Observable } from 'rxjs';
import { UNIQUE_CONSTRAINT_FAILED_CODE} from '../../config/sqlite-error-constants';

@Injectable()
export class ProjectSubprojectRepository {

  public sqlite: SQLite;

  db: SQLiteObject = null;
  private dbReady = new BehaviorSubject<boolean>(false);
  constructor(private platform:Platform) {

  }

  public insert(entity: ProjectSubproject){

       this.platform.ready().then(() => {
                this.sqlite = new SQLite();
                this.sqlite.create(DB_CONFIG).then((db) => {
                  let sql = 'INSERT INTO PROJECT_SUBPROJECT (ID_PROJECT_OF,ID_ELEMENT_PROJECT_OF, ID_ELEMENT_STATUS_PROJECT_OF, ID_SUBPROJECT, ID_ELEMENT_SUBPROJECT,'
                       +'ID_ELEMENT_STATUS_SUBPROJECT,NM_PROJECT_OF,NM_SUBPROJECT) VALUES(?,?,?,?,?,?,?,?)';
                      //  console.info("Objeto " + entity);
                  return db.executeSql(sql, [entity.projectId,entity.elementProjectId, entity.elementProjectStatusId,entity.subprojectId,entity.subprojectElementId,
                                      entity.subprojectElementStatusId,entity.projectName,entity.subprojectName]);
                    }, (error) => {
                        console.info("Unable to execute sql " + JSON.stringify(error));
                    })
             }, (err) => {
                    console.info("Error opening database: " + err);
            });

    }

   public update(entity: ProjectSubproject){
        let sql = 'UPDATE PROJECT_SUBPROJECT SET NM_PROJECT_OF=?, NM_SUBPROJECT=? WHERE ID=?';
        return this.db.executeSql(sql, [entity.projectName,entity.subprojectName]);
   }

   findAll():any{
     let resList:ProjectSubproject []=[];
     return new Promise((resolve,reject)=>{
          this.platform.ready().then(() => {
                this.sqlite = new SQLite();
                this.sqlite.create(DB_CONFIG).then((db) => {

                  let sql = 'SELECT ID_PROJECT_OF,ID_ELEMENT_PROJECT_OF, ID_ELEMENT_STATUS_PROJECT_OF, ID_SUBPROJECT, ID_ELEMENT_SUBPROJECT,ID_ELEMENT_STATUS_SUBPROJECT,NM_PROJECT_OF,NM_SUBPROJECT '
                           +'FROM PROJECT_SUBPROJECT';
                    db.executeSql(sql, {}).then(res => {
                       //console.log("query-item"+JSON.stringify(res));
                           for(var i =0; i< res.rows.length;i++){

                             let row=new ProjectSubproject();
                             row.projectId=res.rows.item(i).ID_PROJECT_OF;
                             row.elementProjectId=res.rows.item(i).ID_ELEMENT_PROJECT_OF;
                             row.elementProjectStatusId=res.rows.item(i).ID_ELEMENT_STATUS_PROJECT_OF;
                             row.subprojectId=res.rows.item(i).ID_SUBPROJECT;
                             row.subprojectElementId=res.rows.item(i).ID_ELEMENT_SUBPROJECT;
                             row.subprojectElementStatusId=res.rows.item(i).ID_ELEMENT_STATUS_SUBPROJECT;
                             row.projectName=res.rows.item(i).NM_PROJECT_OF;
                             row.subprojectName=res.rows.item(i).NM_SUBPROJECT;
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

     public findProjectsByLocalCases():Observable<ProjectSubproject []>{
       let resList:ProjectSubproject []=[];
       return  Observable.create(observer=>{
           this.platform.ready().then(() => {
           this.sqlite = new SQLite();
           this.sqlite.create(DB_CONFIG).then((db:SQLiteObject) => {

                    let sql = 'SELECT PS.ID_PROJECT_OF,PS.ID_ELEMENT_PROJECT_OF, PS.ID_ELEMENT_STATUS_PROJECT_OF, PS.ID_SUBPROJECT, PS.ID_ELEMENT_SUBPROJECT,PS.ID_ELEMENT_STATUS_SUBPROJECT,PS.NM_PROJECT_OF,PS.NM_SUBPROJECT '
                             +'FROM PROJECT_SUBPROJECT PS JOIN CASES CAS WHERE CAS.ID_ELEMENT =PS.ID_ELEMENT_SUBPROJECT AND CAS.FG_SHARED=1';
                      db.executeSql(sql, {}).then(res => {
                         console.info('Executed SQL');
                             for(var i =0; i< res.rows.length;i++){
                               let row=new ProjectSubproject();
                               row.projectId=res.rows.item(i).ID_PROJECT_OF;
                               row.elementProjectId=res.rows.item(i).ID_ELEMENT_PROJECT_OF;
                               row.elementProjectStatusId=res.rows.item(i).ID_ELEMENT_STATUS_PROJECT_OF;
                               row.subprojectId=res.rows.item(i).ID_SUBPROJECT;
                               row.subprojectElementId=res.rows.item(i).ID_ELEMENT_SUBPROJECT;
                               row.subprojectElementStatusId=res.rows.item(i).ID_ELEMENT_STATUS_SUBPROJECT;
                               row.projectName=res.rows.item(i).NM_PROJECT_OF;
                               row.subprojectName=res.rows.item(i).NM_SUBPROJECT;
                               resList.push(row);
                             }
                            observer.next(resList);
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
