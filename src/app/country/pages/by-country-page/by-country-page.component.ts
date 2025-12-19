import { Component, inject, resource, signal } from '@angular/core';
import { SearchInputComponent } from '../../../shared/components/search-input/search-input.component';
import { CountryListComponent } from '../../components/country-list/country-list.component';
import { CountryService } from '../../services/country.service';
import { firstValueFrom } from 'rxjs';

@Component({
  selector: 'app-by-country-page',
  imports: [SearchInputComponent, CountryListComponent],
  templateUrl: './by-country-page.component.html',
})
export class ByCountryPageComponent {
  contryService = inject(CountryService);
  query = signal('');
  contryResource = resource({
    request: () => ({ query: this.query() }),
    loader: async ({ request }) => {
      if (!request.query) return [];
      return firstValueFrom(this.contryService.searchByCountry(request.query));
    },
  });
  onSearch(value: string) {
    console.log({ value });
  }
}
