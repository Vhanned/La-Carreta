import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'truncate'
})
export class TruncatePipe implements PipeTransform {
  transform(value: number | undefined, decimals: number = 2): number {
    if (value === undefined || value === null) {
      return 0; // Devuelve 0 si el valor es undefined o null
    }
    const factor = Math.pow(10, decimals);
    return Math.trunc(value * factor) / factor;
  }
}
