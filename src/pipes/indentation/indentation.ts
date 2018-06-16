import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'indentation',
})
export class IndentationPipe implements PipeTransform {
  /**
   * Takes a value and makes it lowercase.
   */
  transform(value: string, level:number) {
    let indentation:string='';
    for(let cont=level;cont<=level;cont++){
      indentation+=' ';
    }
    return indentation+value;
  }
}
