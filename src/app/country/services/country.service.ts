import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { RESTCountry } from '../interfaces/rest-countries.interface';
import { catchError, delay, map, Observable, of, throwError } from 'rxjs';
import type { Country } from '../interfaces/country.interface';
import { CountryMapper } from '../mappers/country.mapper';

const API_URL = 'https://restcountries.com/v3.1';

@Injectable({
  providedIn: 'root',
})
export class CountryService {
  private http = inject(HttpClient);

  searchByCapital(query: string): Observable<Country[]> {
    const url = `${API_URL}/capital/${query}`;
    query = query.toLowerCase();
    return this.http.get<RESTCountry[]>(url).pipe(
      map((res) => CountryMapper.mapRestCountryArrayToCountryArray(res)),
      catchError((error) => {
        console.log('Error fetching ', error);
        // return throwError(
        //   () => new Error(`Does not get countries with that query ${query}`)
        // );
        return of([]);
      })
    );
  }

  searchByCountry(query: string): Observable<Country[]> {
    const url = `${API_URL}/name/${query}`;
    query = query.toLowerCase();
    return this.http.get<RESTCountry[]>(url).pipe(
      delay(2000),
      map((res) => CountryMapper.mapRestCountryArrayToCountryArray(res)),
      catchError((error) => {
        return throwError(
          () => new Error(`Does not get countries with that name ${query}`)
        );
      })
    );
  }

  searchByAlphaCode(code: string) {
    const url = `${API_URL}/alpha/${code}`;

    return this.http.get<RESTCountry[]>(url).pipe(
      map((resp) => CountryMapper.mapRestCountryArrayToCountryArray(resp)),
      map((countries) => countries.at(0)),
      catchError((error) => {
        console.log('Error fetching ', error);

        return throwError(
          () => new Error(`Does not get country with that code ${code}`)
        );
      })
    );
  }
}
