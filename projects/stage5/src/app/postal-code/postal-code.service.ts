import { HttpClient, HttpParams } from '@angular/common/http'
import { Injectable } from '@angular/core'
import { defaultIfEmpty, mergeMap, Observable } from 'rxjs'
import { environment } from 'src/environments/environment'

export interface IPostalCode {
  countryCode: string
  postalCode: string
  placeName: string
  lng: number
  lat: number
}

export interface IPostalCodeData {
  postalCodes: IPostalCode[]
}

export interface IPostalCodeService {
  resolvePostalCode(postalCode: string): Observable<IPostalCode | null>
}

/**
 * PostalCodeService
 * - Lightweight placeholder service created so the file/folder appears in the Explorer.
 * - Replace the mock implementation with a real HTTP call when you're ready.
 */
@Injectable({ providedIn: 'root' })
export class PostalCodeService implements IPostalCodeService {
  constructor(private httpClient: HttpClient) {}

  resolvePostalCode(postalCode: string): Observable<IPostalCode | null> {
    const uriParams = new HttpParams()
      .set('maxRows', '1')
      .set('username', environment.username)
      .set('postalcode', postalCode)

    return this.httpClient
      .get<IPostalCodeData>(
        `${environment.baseUrl}${environment.geonamesApi}.geonames.org/postalCodeSearchJSON`,
        {
          params: uriParams,
        }
      )
      .pipe(
        mergeMap((data) => data.postalCodes),
        defaultIfEmpty(null)
      )
  }
}
