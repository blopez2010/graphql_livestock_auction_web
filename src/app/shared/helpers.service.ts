import { Injectable } from '@angular/core';
import { MatAutocomplete } from '@angular/material';

@Injectable({
  providedIn: 'root'
})
export class HelpersService {
  constructor() {}

  public displayFn(item, matAutocomplete: MatAutocomplete) {
    return matAutocomplete.options
      .filter(x => x.value === item)
      .map(x => x.viewValue)[0]
      ? matAutocomplete.options
          .filter(x => x.value === item)
          .map(x => x.viewValue)[0]
      : item;
  }
}
