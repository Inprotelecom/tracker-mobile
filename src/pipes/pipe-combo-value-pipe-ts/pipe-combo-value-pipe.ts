import { Pipe, PipeTransform } from '@angular/core';
import { ComboValue } from '../../app/clases/entities/combo-value';
@Pipe({
  name: 'pipeComboValuePipe',
})
export class PipeComboValuePipe implements PipeTransform {
  /**
   * Takes a value and makes it lowercase.
   */
  transform(lista: ComboValue[], ...args) {
    console.info("Como value spipe:"+JSON.stringify(lista));
    return lista==undefined? []:lista;
  }
}
