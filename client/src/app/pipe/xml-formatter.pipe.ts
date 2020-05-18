import { Pipe, PipeTransform } from '@angular/core';
import * as vkbeautify from 'vkbeautify';

@Pipe({
  name: 'xmlFormatter'
})
export class XmlFormatterPipe implements PipeTransform {

  transform(value: string): string {
    if (value)
      return vkbeautify.xml(value);
  }

}
