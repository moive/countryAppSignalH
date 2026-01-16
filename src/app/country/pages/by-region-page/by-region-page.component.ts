import {
  Component,
  computed,
  inject,
  linkedSignal,
  signal,
} from '@angular/core';
import { CountryListComponent } from '../../components/country-list/country-list.component';
import { Region } from '../../interfaces/region.type';
import { rxResource } from '@angular/core/rxjs-interop';
import { of } from 'rxjs';
import { CountryService } from '../../services/country.service';
import { Router, ActivatedRoute } from '@angular/router';

function validateQueryParams(query: string) {
  query = query.toLowerCase();

  const validRegions: Record<string, Region> = {
    africa: 'Africa',
    americas: 'Americas',
    asia: 'Asia',
    europe: 'Europe',
    oceania: 'Oceania',
    antarctic: 'Antarctic',
  };

  return validRegions[query] ?? 'Americas';
}

@Component({
  selector: 'app-by-region-page',
  imports: [CountryListComponent],
  templateUrl: './by-region-page.component.html',
})
export class ByRegionPageComponent {
  countryService = inject(CountryService);

  router = inject(Router);
  activatedRouter = inject(ActivatedRoute);
  queryParams = this.activatedRouter.snapshot.queryParamMap.get('region') ?? '';

  public regions: Region[] = [
    'Africa',
    'Americas',
    'Asia',
    'Europe',
    'Oceania',
    'Antarctic',
  ];

  selectedRegion = linkedSignal<Region | null>(() =>
    validateQueryParams(this.queryParams)
  );

  countryResource = rxResource({
    params: () => ({ region: this.selectedRegion() }),
    stream: ({ params }) => {
      if (!params.region) return of([]);
      this.router.navigate(['/country/by-region'], {
        queryParams: { region: params.region },
      });
      return this.countryService.searchByRegion(params.region);
    },
  });

  selectRegion(region: Region) {
    this.selectedRegion.set(region);
  }
}
