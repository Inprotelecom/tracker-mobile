import { Pipe, PipeTransform } from '@angular/core';
import { URL_TRACKER_SERVICE,TRACKER_IMAGES} from '../../config/url.services';

@Pipe({
  name: 'trackerImages',
})
export class TrackerImagesPipe implements PipeTransform {
  transform(value: number, ...args) {
    let image:String=`${URL_TRACKER_SERVICE}${TRACKER_IMAGES}?image=${value}`;
    console.info('URL'+image);
    return image;
  }
}
