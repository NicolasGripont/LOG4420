import { Pipe, PipeTransform} from "@angular/core";


@Pipe({name: 'priceFormatPipe'})
export class PriceFormatPipe implements PipeTransform {
  transform(price: number) : string {
    let priceFormatted = "" + price;
    return priceFormatted.replace('.',',');;
  }
}
