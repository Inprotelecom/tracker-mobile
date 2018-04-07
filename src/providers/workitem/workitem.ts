import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { WorkitemElement} from '../../app/clases/entities/workitem-element';
import { WiElementAttribute} from '../../app/clases/entities/wi-element-attribute';
import { WorkItemElementRepository} from '../repository/workitem-element';
import { WiElementAttributeRepository} from '../repository/wi-element-attribute';

@Injectable()
export class WorkitemProvider {

  constructor(private workItemElementRepository:WorkItemElementRepository,
              private wiElementAttributeRepository:WiElementAttributeRepository) {
  }

  findWorkitemByCaseId(caseId:number):Observable<WorkitemElement[]>{
    return this.workItemElementRepository.findWiByCaseId(caseId);
  }

  findWiElementAttributeByWiElement(elementId:number):Observable<WiElementAttribute[]>{
    return this.wiElementAttributeRepository.findWorkitemElementId(elementId);
  }

}
