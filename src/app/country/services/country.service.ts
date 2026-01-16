import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { catchError, delay, map, Observable, of, tap, throwError } from 'rxjs';

import { RESTCountry } from '../interfaces/rest-countries.interface';
import type { Country } from '../interfaces/country.interface';
import { Region } from '../interfaces/region.type';

import { CountryMapper } from '../mappers/country.mapper';

const API_URL = 'https://restcountries.com/v3.1';

@Injectable({
  providedIn: 'root',
})
export class CountryService {
  private http = inject(HttpClient);
  private queryCacheCapital = new Map<string, Country[]>();
  private queryCacheCountry = new Map<string, Country[]>();
  private queryCacheRegion = new Map<Region, Country[]>();

  searchByCapital(query: string): Observable<Country[]> {
    const url = `${API_URL}/capital/${query}`;
    query = query.toLowerCase();

    if (this.queryCacheCapital.has(query)) {
      return of(this.queryCacheCapital.get(query) ?? []);
    }

    // console.log(this.queryCacheCapital);

    return this.http.get<RESTCountry[]>(url).pipe(
      map((res) => CountryMapper.mapRestCountryArrayToCountryArray(res)),
      tap((countries) => this.queryCacheCapital.set(query, countries)),
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

    if (this.queryCacheCountry.has(query)) {
      return of(this.queryCacheCountry.get(query)!);
    }

    return this.http.get<RESTCountry[]>(url).pipe(
      delay(2000),
      map((res) => CountryMapper.mapRestCountryArrayToCountryArray(res)),
      tap((countries) => this.queryCacheCountry.set(query, countries)),
      catchError((error) => {
        console.log('Error fetching ', error);
        // return throwError(
        //   () => new Error(`Does not get countries with that name ${query}`)
        // );
        return of([]);
      })
    );
  }

  searchByRegion(region: Region): Observable<Country[]> {
    const url = `${API_URL}/region/${region}`;

    if (this.queryCacheRegion.has(region)) {
      return of(this.queryCacheRegion.get(region)!);
    }

    return this.http.get<RESTCountry[]>(url).pipe(
      map((res) => CountryMapper.mapRestCountryArrayToCountryArray(res)),
      tap((countries) => this.queryCacheRegion.set(region, countries)),
      catchError((error) => {
        console.log('Error fetching ', error);
        // return throwError(
        //   () => new Error(`Does not get countries with that name ${query}`)
        // );
        return of([]);
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
