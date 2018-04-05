import { Injectable } from '@angular/core';
import { WorkItemElementRepository} from '../repository/workitem-element';
import { Observable } from 'rxjs';
import { WorkitemElement} from '../../app/clases/entities/workitem-element';

@Injectable()
export class WorkitemProvider {

  constructor(private workItemElementRepository:WorkItemElementRepository) {
  }

  findWorkitemByCaseId(caseId:number):Observable<WorkitemElement[]>{
    return this.workItemElementRepository.findWiByCaseId(caseId);
  }

}
