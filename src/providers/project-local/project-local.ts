import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import { Observable } from 'rxjs';
import { Injectable } from '@angular/core';

import { ProjectSubprojectRepository} from '../repository/project-subproject';
import { CasesRepository} from '../repository/cases';
import { ElementTypeConfigAttributeRepository} from '../repository/element-type-config-attributes';
import { WorkItemElementRepository} from '../repository/workitem-element';

import { WorkitemElement} from '../../app/clases/entities/workitem-element';
import { ElementTypeConfigAttribute} from '../../app/clases/entities/element-type-config-attributes';
import { ProjectSubproject} from '../../app/clases/entities/project-subproject';
import { Cases} from '../../app/clases/entities/cases';

@Injectable()
export class ProjectLocalProvider {

  constructor(private projectSubprojectRepository:ProjectSubprojectRepository,
              private casesRepository:CasesRepository,
              private elementTypeConfigAttributeRepository:ElementTypeConfigAttributeRepository,
              private workItemElementRepository:WorkItemElementRepository ) {

  }

  findAllProjects():Observable<ProjectSubproject[]>{
    return this.projectSubprojectRepository.findProjectsByLocalCases();
  }

}
