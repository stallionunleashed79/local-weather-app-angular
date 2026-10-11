import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing'
import { TestBed } from '@angular/core/testing'
import { ICurrentWeatherData } from 'src/app/weather/weather.service'

import { environment } from '../../environments/environment' // Import the real environment
import { ICurrentWeather } from '../interfaces'
import { WeatherService } from './weather.service'

describe('WeatherService', () => {
  let service: WeatherService
  let httpMock: HttpTestingController
  const mockBaseUrl = 'https://mock-weather-api.com'
  const mockAppId = '123456789abcdef'
  let originalBaseUrl: string
  let originalAppId: string

  beforeEach(() => {
    originalBaseUrl = environment.baseUrl
    originalAppId = environment.appId

    environment.baseUrl = mockBaseUrl
    environment.appId = mockAppId

    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [WeatherService],
    })

    service = TestBed.inject(WeatherService)
    httpMock = TestBed.inject(HttpTestingController)
  })

  afterEach(() => {
    // Restore original configuration after each test run
    environment.baseUrl = originalBaseUrl
    environment.appId = originalAppId

    httpMock.verify() // Optional: Ensures no outstanding HTTP requests remain unhandled
  })

  it('should be created', () => {
    expect(service).toBeTruthy()
  })

  it('should get the current weather by coordinates', () => {
    const mockWeatherData: ICurrentWeatherData = {
      weather: [
        {
          description: 'clear sky',
          icon: '01d',
        },
      ],
      main: {
        temp: 298.48,
      },
      sys: {
        country: 'US',
      },
      dt: 1618317040,
      name: 'Mountain View',
    }
    const mockWeather = {
      city: mockWeatherData.name,
      country: mockWeatherData.sys.country,
      date: mockWeatherData.dt * 1000,
      image: 'http://openweathermap.org/img/w/01d.png',
      temperature: (mockWeatherData.main.temp * 9) / 5 - 459.67,
      description: mockWeatherData.weather[0].description,
    } as ICurrentWeather
    const lat = 37.3861
    const lon = -122.0839

    // 2. Call the service method and subscribe to the result
    service.getCurrentWeatherByCoords({ lat, lon }).subscribe((data) => {
      expect(data).toEqual(mockWeather)
      expect(data.city).toBe('Mountain View')
      expect(data.temperature).toBe((mockWeatherData.main.temp * 9) / 5 - 459.67)
    })

    // Verify that the HTTP request goes to the mocked URL
    // 3. Expect and intercept the HTTP request
    // Since HttpParams appends queries, we match the base URL structure or use a predicate function
    const req = httpMock.expectOne((request) => {
      return (
        request.url.startsWith(mockBaseUrl) &&
        request.params.get('lat') === lat.toString() &&
        request.params.get('lon') === lon.toString()
      )
    })

    // 4. Assert the request method
    expect(req.request.method).toBe('GET')

    // 5. Flush the mock data to resolve the observable stream
    req.flush(mockWeatherData)
  })
})
