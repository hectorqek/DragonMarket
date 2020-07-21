import { Pipe, PipeTransform } from '@angular/core';
import { GLOBAL } from '../../services/global';

@Pipe({
  name: 'sinfoto'
})
export class SinfotoPipe implements PipeTransform {

  transform(value: any): any {

    let url = GLOBAL.url;
    if (value === 'https://naranja.blob.core.windows.net/dragonmarket/SinImagen') {
      return 'assets/images/noimage.png';
    }else if (value === '') {
        return 'assets/images/noimage.png';
    }else if (value === null){
        return 'assets/images/noimage.png';
    }
    return value;

  }

}
