import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'search'
})
export class SearchPipe implements PipeTransform {

  transform(value, args: string): any {

    console.log(JSON.stringify(value));

    if (!value) {
      return;
    }

    if (!args) {
      return value;
    }

    args = args.toLowerCase();

    return value.filter(item => {
      return JSON.stringify(item)
        .toLowerCase()
        .includes(args)
    });
  }

}
