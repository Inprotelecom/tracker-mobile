import { Injectable } from '@angular/core';
import { SQLite, SQLiteObject } from '@ionic-native/sqlite';
import { ProjectSubproject} from '../../app/clases/entities/project-subproject';
import { Platform } from 'ionic-angular';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';

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
                this.sqlite.create({ name: 'tracker-mobile.db', location: 'default' }).then((db) => {
                  let sql = 'INSERT INTO PROJECT_SUBPROJECT(ID_PROJECT_OF,ID_ELEMENT_PROJECT_OF, ID_ELEMENT_STATUS_PROJECT_OF, ID_SUBPROJECT, ID_ELEMENT_SUBPROJECT,'
                           +'ID_ELEMENT_STATUS_SUBPROJECT,NM_PROJECT_OF,NM_SUBPROJECT) VALUES(?,?,?,?,?,?,?,?)';
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


}
