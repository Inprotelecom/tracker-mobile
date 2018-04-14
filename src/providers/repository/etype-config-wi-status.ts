import {Injectable} from '@angular/core';
import {SQLite, SQLiteObject} from '@ionic-native/sqlite';
import {Platform} from 'ionic-angular';
import {DB_CONFIG} from '../../config/app-constants';
import {Observable} from 'rxjs';
import {EtypeConfigWiStatus} from "../../app/clases/entities/etype-config-wi-status";
import {WorkItemStatus} from "../../app/clases/entities/workitem-status";

@Injectable()
export class EtypeConfigWiStatusRepository {

  public sqlite: SQLite;

  db: SQLiteObject = null;

  constructor(private platform: Platform) {

  }

  public insert(entity: EtypeConfigWiStatus): Observable<boolean> {
    console.log("InserT EtypeConfigWiStatus")
    return Observable.create(observer => {
      this.platform.ready().then(() => {
        this.sqlite = new SQLite();
        this.sqlite.create(DB_CONFIG).then((db: SQLiteObject) => {
          let sql = 'INSERT INTO ETYPE_CONFIG_WI_STATUS (ID_WORK_ITEM_STATUS,ID_ELEMENT_TYPE_CONFIG) VALUES(?,?)';
          db.executeSql(sql, [entity.workitemStatusId, entity.elementTypeConfigId])
            .then(() => {
              console.info('Executed SQL');
              observer.next(true);
              observer.complete();
            }).catch(e => {
            console.log("Error inserting 1:" + JSON.stringify(e));
            observer.next(false);
            observer.complete();
          });

        }).catch(e => {
          console.error("Error inserting 2:" + JSON.stringify(e));
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

  public deleteByCaseId(caseId: number):Observable<boolean>{
    return  Observable.create(observer=>{
      this.platform.ready().then(() => {
        this.sqlite = new SQLite();
        this.sqlite.create(DB_CONFIG).then((db:SQLiteObject) => {

          let sql = 'DELETE FROM ETYPE_CONFIG_WI_STATUS WHERE ID_ELEMENT_TYPE_CONFIG IN '
                   +'(SELECT ID_ELEMENT_TYPE_CONFIG FROM WORKITEM_ELEMENT WHERE ID_CASE=?) ';
          db.executeSql(sql, [caseId])
            .then(()=>{
              console.info('Executed SQL');
              observer.next(true);
              observer.complete();
            }).catch(e=> {
            console.log("Error DELETING:"+JSON.stringify(e));
            observer.next(false);
            observer.complete();
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

  public findByElementTypeConfigId(elementTypeConfigId: number): Observable<EtypeConfigWiStatus[]> {
    let etypeConfigWiStatus: EtypeConfigWiStatus = null;
    let etypeWiConfigList:EtypeConfigWiStatus[]=[];
    return Observable.create(observer => {
      this.platform.ready().then(() => {
        this.sqlite = new SQLite();
        this.sqlite.create(DB_CONFIG).then((db: SQLiteObject) => {

          let sql = 'SELECT ew.ID_WORK_ITEM_STATUS,ew.ID_ELEMENT_TYPE_CONFIG,NM_WORK_ITEM_STATUS FROM ETYPE_CONFIG_WI_STATUS ew '
                   +'JOIN WORK_ITEM_STATUS ws ON ws.ID_WORK_ITEM_STATUS=EW.ID_WORK_ITEM_STATUS '
                   +'WHERE ID_ELEMENT_TYPE_CONFIG='+elementTypeConfigId;
          db.executeSql(sql, {}).then(res => {
            for (var i = 0; i < res.rows.length; i++) {
              etypeConfigWiStatus = new EtypeConfigWiStatus();
              etypeConfigWiStatus.elementTypeConfigId = res.rows.item(i).ID_ELEMENT_TYPE_CONFIG;
              etypeConfigWiStatus.workitemStatusId = res.rows.item(i).ID_WORK_ITEM_STATUS;
              etypeConfigWiStatus.workitemStatus = new WorkItemStatus();
              etypeConfigWiStatus.workitemStatus.name = res.rows.item(i).NM_WORK_ITEM_STATUS;
              etypeConfigWiStatus.workitemStatus.workitemStatusId = etypeConfigWiStatus.workitemStatusId;
              etypeWiConfigList.push(etypeConfigWiStatus);
            }
            observer.next(etypeWiConfigList);
            observer.complete();
          }).catch(e => {
            console.error("Error querying:" + JSON.stringify(e));
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
