import { Pipe, PipeTransform} from "@angular/core";


@Pipe({name: 'confirmationNumberFormatPipe'})
export class ConfirmationNumberFormatPipe implements PipeTransform {
  transform(confirmationNumber: number) : string {
    return ("0000" + confirmationNumber).slice(-5);
  }
}
