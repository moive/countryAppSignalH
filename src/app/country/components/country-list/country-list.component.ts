import { Component, input } from '@angular/core';
import type { Country } from '../../interfaces/country.interface';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'country-list',
  imports: [RouterLink],
  templateUrl: './country-list.component.html',
  styleUrl: './country-list.component.css',
})
export class CountryListComponent {
  countries = input.required<Country[]>();
}
