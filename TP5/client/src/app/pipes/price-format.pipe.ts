import { Pipe, PipeTransform} from "@angular/core";

/**
 * Pipe that transform price number to price string with a ',' instead of '.' and with two decimal digit.
 */
@Pipe({name: 'priceFormatPipe'})
export class PriceFormatPipe implements PipeTransform {
  transform(price: number) : string {
    let priceFormatted = "" + price.toFixed(2);
    return priceFormatted.replace('.',',');
  }
}
