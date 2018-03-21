import { Component } from '@angular/core';

import { UploadList } from '../upload/upload-list';
import { PendientesComponent } from '../pendientes/pendientes.component';
import { TerminadosComponent } from '../terminados/terminados.component';

@Component({
  templateUrl: 'tabs.html'
})
export class TabsPage {

  tab1Root = UploadList;
  tab2Root = TerminadosComponent;

  constructor() {

  }
}
