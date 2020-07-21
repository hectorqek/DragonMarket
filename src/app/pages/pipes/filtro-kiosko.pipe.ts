import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'filtroKiosko'
})
export class FiltroKioskoPipe implements PipeTransform {

  transform(items: any[], field: string, value: number): any[] {
    if (!items) {
        return [];
    }
    if (!field || !value) {
        return items;
    }
    return items.filter(singleItem => singleItem[field] === value);

  }
}

