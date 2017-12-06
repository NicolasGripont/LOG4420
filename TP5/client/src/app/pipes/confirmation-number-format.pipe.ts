import { Pipe, PipeTransform} from "@angular/core";

/**
 * Pipe that transform order number id to a five number length id string. (add zeros on left if needed)
 */
@Pipe({name: 'confirmationNumberFormatPipe'})
export class ConfirmationNumberFormatPipe implements PipeTransform {
  transform(confirmationNumber: number) : string {
    return ("0000" + confirmationNumber).slice(-5);
  }
}
