import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/concat';
import 'rxjs/add/operator/merge';
import {Observable} from 'rxjs';
import {Http} from '@angular/http';
import {Injectable} from '@angular/core';
import {Platform} from 'ionic-angular';
import {CORDOVA} from '../../config/app-constants';
import {
  URL_TRACKER_SERVICE,
  WORKITEMS_FLOW,
  ATTRIBUTES,
  WI_ATTRIBUTTES,
  ETYPE_CONFIG_WI_STATUS
} from '../../config/url.services';
import {ElementTypeConfigAttribute} from '../../app/clases/entities/element-type-config-attributes';
import dateFormat from 'dateformat';
import {DT_FORMAT_WEB} from '../../config/app-constants';
import * as _ from "lodash";
import {WorkitemElement} from '../../app/clases/entities/workitem-element';
import {Cases} from '../../app/clases/entities/cases';
import {Attribute} from '../../app/clases/entities/attribute';
import {WorkItemStatus} from '../../app/clases/entities/workitem-status';
import {ComboValue} from '../../app/clases/entities/combo-value';
import {WiElementAttribute} from '../../app/clases/entities/wi-element-attribute';
import {ElementTypeConfigAttributeRepository} from '../repository/element-type-config-attributes';
import {WorkItemElementRepository} from '../repository/workitem-element';
import {CasesRepository} from '../repository/cases';
import {AttributeRepository} from '../repository/attribute';
import {ComboValueRepository} from '../repository/combo-value';
import {WiElementAttributeRepository} from '../repository/wi-element-attribute';
import {WorkItemStatusRepository} from '../repository/workitem-status';
import {EtypeConfigWiStatusRepository} from '../repository/etype-config-wi-status';
import {EtypeConfigWiStatus} from "../../app/clases/entities/etype-config-wi-status";
import {FilesProvider} from "../files/files";
@Injectable()
export class WorkitemFlowProvider {

  workitemflow: WorkitemElement[] = [];
  etypeList: ElementTypeConfigAttribute[] = [];

  constructor(private http: Http,
              private platform: Platform,
              private workItemElementRepository: WorkItemElementRepository,
              private elementTypeConfigAttributeRepository: ElementTypeConfigAttributeRepository,
              private casesRepository: CasesRepository,
              private attributeRepository: AttributeRepository,
              private comboValueRepository: ComboValueRepository,
              private wiElementAttributeRepository: WiElementAttributeRepository,
              private workItemStatusRepository: WorkItemStatusRepository,
              private etypeConfigWiStatusRepository: EtypeConfigWiStatusRepository,
              private filesProvider: FilesProvider) {

  }


  public shareCases(cases: Cases, areaId: number): Observable<any> {
    let caseItem = _.cloneDeep(cases);
    let urlWi = URL_TRACKER_SERVICE + WORKITEMS_FLOW + "?elementId=" + caseItem.elementId
      + "&caseId=" + caseItem.caseId + "&areaId=" + areaId;
    let urlAttributes = URL_TRACKER_SERVICE + ATTRIBUTES;

    return Observable.forkJoin([this.getRestResponse(urlWi), this.getRestResponse(urlAttributes)])
      .map((resp: any[]) => {
        console.log('map fork http:' + resp);
        return resp;
      }).flatMap(data => {
        WI_ATTRIBUTTES

        let wiList = _(data[0].workFlow)
          .groupBy(item => item.workitemElementId)
          .flatMapDeep(_.values)
          .map((item:any) => item.workitemElementId)
          .value()
          .filter(item => item != undefined)
          .join(',');


        let etypeConfigList = _(data[0].workFlow)
          .groupBy(item => item.elementTypeConfigId)
          .flatMapDeep(_.values)
          .map((item:any) => item.elementTypeConfigId)
          .value()
          .filter(item => item != undefined)
          .join(',');

        console.log('List to services:' + wiList + '-' + etypeConfigList);

        let urlWiAttribute = URL_TRACKER_SERVICE + WI_ATTRIBUTTES
          + '?wiElementList=' + wiList;
        let urlEtypeConfigWiStatus = URL_TRACKER_SERVICE + ETYPE_CONFIG_WI_STATUS
          + '?etypeConfigWiStatusList=' + etypeConfigList;
        //consulta el servicio de wiAttribute con base a los wi recibidos
        //de la primera consulta dentro del forkJoin y regresa los tre resultados
        return Observable.forkJoin(
          this.getRestResponse(urlWiAttribute),
          this.getRestResponse(urlEtypeConfigWiStatus))

          .map(resp => {
            return [data[0], data[1], resp[0], resp[1]];
          });
      }).flatMap(data => {
        console.log("http forkjoin:" + JSON.stringify(data[2]));
        caseItem.shared = 1;
        caseItem.sharedDate = '' + dateFormat(new Date(), DT_FORMAT_WEB, true);
        return Observable.forkJoin([this.processEtypeConfig(data[0].elementTypeConfigAttribute),
          this.processWiElement(data[0].workFlow),
          this.processAttribute(data[1].attribute),
          this.processComboCategory(data[1].combo),
          this.processWorkItemStatus(data[1].workitemStatus),
          this.processWiElementAttribute(data[2]),
          this.processEtypeConfigWiStatus(data[3]),
          this.casesRepository.update(caseItem)])

          .map(resp => {
            console.log("resp forkjoin insert:" + JSON.stringify(resp));
            let boolean = resp[0] && resp[1] && resp[2] && resp[3] && resp[4];
            if (resp[5]) {
              return ([boolean, caseItem]);
            } else {
              return ([boolean, cases]);
            }
          })

      })

  }

  private getRestResponse(url: string): Observable<any> {
    return this.http.get(url).map((resp: any) => resp.json());
  }


  public deleteCases(cases: Cases): Observable<any> {
    let caseItem = _.cloneDeep(cases);
    caseItem.shared = 0;
    return Observable.forkJoin(
      [this.workItemElementRepository.deleteByCaseId(caseItem.caseId),
        this.casesRepository.update(caseItem)])
      .map(resp => {
        console.log("Resp fork all observables:" + resp + " ");
        let boolean = resp[0] && resp[1];
        if (boolean) {
          return [boolean, caseItem];
        } else {
          return [boolean, cases];
        }
      });


  }

  private processWiElement(list: any): Observable<boolean> {
    let listObservables: Observable<boolean>[] = [];
    list.forEach(data => {
      let wi = new WorkitemElement();
      console.log("WIElement:" + JSON.stringify(data));
      wi.caseId = data.caseId;
      wi.elementId = data.elementId;
      wi.elementTypeConfigId = data.elementTypeConfigId;
      wi.notes = data.notes;
      wi.order = data.order;
      wi.parent = data.parent;
      wi.sequencial = data.sequencial;
      wi.workItemStatus = data.workItemStatus;
      wi.workItemStatusId = data.workItemStatusId;
      wi.workitemElementId = data.workitemElementId;
      wi.workitemTemplate = data.workitemTemplate;
      wi.workitemTemplateId = data.workitemTemplateId;
      this.workitemflow.push(wi);
      listObservables.push(this.workItemElementRepository.insert(wi));

    })

    if (this.platform.is(CORDOVA) && listObservables.length > 0) {
      return Observable.forkJoin(listObservables).map(resp => {
        return resp.filter(r => !r).length > 0 == false;
      });
    } else {
      return Observable.of('').map(resp => true);
    }

  }

  private processEtypeConfig(list: any): Observable<boolean> {
    let listObservables: Observable<boolean>[] = [];
    list.forEach(data => {
      console.log("Element Type: " + JSON.stringify(data));
      let etype = new ElementTypeConfigAttribute();
      etype.attributeId = data.attributeId;
      etype.attributeTypeId = data.attributeTypeId;
      etype.comboCategoryId = data.comboCategoryId;
      etype.elementTypeConfigId = data.elementTypeConfigId;
      etype.mandatory = data.mandatory;
      this.etypeList.push(etype);
      listObservables.push(this.elementTypeConfigAttributeRepository.insert(etype));
    });

    if (this.platform.is(CORDOVA) && listObservables.length > 0) {
      return Observable.forkJoin(listObservables).map(resp => {
        return resp.filter(r => !r).length > 0 == false;
      });
    } else {
      return Observable.of('').map(resp => true);
    }


  }

  private processAttribute(list: any): Observable<boolean> {
    let listObservables: Observable<boolean>[] = [];
    list.forEach(data => {
      console.log("Attribute: " + JSON.stringify(data));
      let attribute = new Attribute();
      attribute.attributeId = data.attributeId;
      attribute.attributeTypeId = data.attributeTypeId;
      attribute.attributeTypeJavaType = data.attributeTypeJavaType;
      attribute.attributeTypeName = data.attributeTypeName;
      attribute.attributeTypeWebComponent = data.attributeTypeWebComponent;
      attribute.code = data.code;
      attribute.comboCategoryId = data.comboCategoryId;
      attribute.name = data.name;
      attribute.sizeAttribute = data.sizeAttribute;
      listObservables.push(this.attributeRepository.insert(attribute));
    });

    if (this.platform.is(CORDOVA) && listObservables.length > 0) {
      return Observable.forkJoin(listObservables).map(resp => {
        return resp.filter(r => !r).length > 0 == false;
      });
    } else {
      return Observable.of('').map(resp => true);
    }

  }

  private processComboCategory(list: any): Observable<boolean> {
    let listObservables: Observable<boolean>[] = [];
    list.forEach(data => {
      let comboValue = new ComboValue();
      comboValue.comboValueId = data.comboValueId;
      comboValue.comboCategoryId = data.comboCategoryId;
      comboValue.label = data.label;
      comboValue.value = data.value;
      listObservables.push(this.comboValueRepository.insert(comboValue));
    });

    if (this.platform.is(CORDOVA) && listObservables.length > 0) {
      return Observable.forkJoin(listObservables).map(resp => {
        return resp.filter(r => !r).length > 0 == false;
      });
    } else {
      return Observable.of('').map(resp => true);
    }

  }

  private processWorkItemStatus(list: any): Observable<boolean> {
    let listObservables: Observable<boolean>[] = [];
    list.forEach(data => {
      console.log("Wi status: " + JSON.stringify(data));
      let wiStatus = new WorkItemStatus();
      wiStatus.workitemStatusId = data.workitemStatusId;
      wiStatus.name = data.name;
      listObservables.push(this.workItemStatusRepository.insert(wiStatus));
    });
    if (this.platform.is(CORDOVA) && listObservables.length > 0) {
      return Observable.forkJoin(listObservables).map(resp => {
        return resp.filter(r => !r).length > 0 == false;
      });
    } else {
      return Observable.of('').map(resp => true);
    }
  }


  private processWiElementAttribute(list: any): Observable<boolean> {
    let listObservables: Observable<boolean>[] = [];
    list.forEach(data => {
      console.log("wI attribute: " + JSON.stringify(data));
      let wiAttribute = new WiElementAttribute();
      wiAttribute.attributeId = data.attributeId;
      wiAttribute.value = data.value;
      wiAttribute.wiElementAttributeId = data.wiElementAttributeId;
      wiAttribute.workitemElementId = data.workitemElementId;
      wiAttribute.synced = true;
      listObservables.push(this.wiElementAttributeRepository.insert(wiAttribute));
    });

    if (this.platform.is(CORDOVA) && listObservables.length > 0) {
      return Observable.forkJoin(listObservables).map(resp => {
        return resp.filter(r => !r).length > 0 == false;
      });
    } else {
      return Observable.of('').map(resp => true);
    }
  }

  private processEtypeConfigWiStatus(list: any): Observable<boolean> {
    let listObservables: Observable<boolean>[] = [];
    list.forEach(data => {
      console.log("EtypeConfig WiStatus: " + JSON.stringify(data));
      let etypeConfigWiStatus = new EtypeConfigWiStatus();
      etypeConfigWiStatus.elementTypeConfigId = data.elementTypeConfigId;
      etypeConfigWiStatus.workitemStatusId = data.workitemStatusId;
      listObservables.push(this.etypeConfigWiStatusRepository.insert(etypeConfigWiStatus));
    });


    if (this.platform.is(CORDOVA) && listObservables.length > 0) {
      return Observable.forkJoin(listObservables).map(resp => {
        return resp.filter(r => !r).length > 0 == false;
      });
    } else {
      return Observable.of('').map(resp => true);
    }
  }

}
