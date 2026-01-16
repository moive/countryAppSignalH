import {
  Component,
  inject,
  linkedSignal,
  resource,
  signal,
} from '@angular/core';
import { firstValueFrom, of } from 'rxjs';
import { rxResource } from '@angular/core/rxjs-interop';
import { SearchInputComponent } from '../../../shared/components/search-input/search-input.component';
import { CountryListComponent } from '../../components/country-list/country-list.component';
import { CountryService } from '../../services/country.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-by-country-page',
  imports: [SearchInputComponent, CountryListComponent],
  templateUrl: './by-country-page.component.html',
})
export class ByCountryPageComponent {
  countryService = inject(CountryService);
  router = inject(Router);
  activatedRouter = inject(ActivatedRoute);
  queryParams = this.activatedRouter.snapshot.queryParamMap.get('query') ?? '';

  query = linkedSignal(() => this.queryParams);
  countryResource = rxResource({
    params: () => ({ query: this.query() }),
    stream: ({ params }) => {
      if (!params.query) return of([]);
      this.router.navigate(['/country/by-country'], {
        queryParams: { query: params.query },
      });
      return this.countryService.searchByCountry(params.query);
    },
  });
  onSearch(value: string) {
    console.log({ value });
  }
}
