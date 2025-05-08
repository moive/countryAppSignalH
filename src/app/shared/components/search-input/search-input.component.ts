import { Component, input, output } from '@angular/core';

@Component({
  selector: 'country-search-input',
  imports: [],
  templateUrl: './search-input.component.html',
  styleUrl: './search-input.component.css',
})
export class SearchInputComponent {
  placeholder = input<string>('Searching...');
  textButton = input<string>('Submit');
  search = output<string>();
  onSearch(value: string) {
    // console.log({ value });
    this.search.emit(value);
  }
}
