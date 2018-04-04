import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ProjectLocalPage } from './project-local';

@NgModule({
  declarations: [
    ProjectLocalPage,
  ],
  imports: [
    IonicPageModule.forChild(ProjectLocalPage),
  ],
})
export class ProjectLocalPageModule {}
