import type { Country } from '../interfaces/country.interface';
import type { RESTCountry } from '../interfaces/rest-countries.interface';

export class CountryMapper {
  static mapRestCountryToCountry(restCountry: RESTCountry): Country {
    return {
      capital: restCountry.capital.join(','),
      cca2: restCountry.cca2,
      flag: restCountry.flag,
      flagSvg: restCountry.flags.svg,
      name: restCountry.translations['spa']?.common ?? 'No spanish name',
      population: restCountry.population,
    };
  }

  static mapRestCountryArrayToCountryArray(
    restCountry: RESTCountry[]
  ): Country[] {
    return restCountry.map(this.mapRestCountryToCountry);
  }
}
