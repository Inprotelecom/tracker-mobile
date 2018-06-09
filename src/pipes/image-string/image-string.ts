import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'imageString',
})
export class ImageStringPipe implements PipeTransform {

  transform(value: string, ...args) {
    return 'data:image/jpeg;base64,'+value;
  }
}
