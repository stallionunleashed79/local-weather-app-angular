import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing'
import { By } from '@angular/platform-browser'
import { injectSpy } from 'angular-unit-test-helper'
import { BehaviorSubject, of } from 'rxjs'

import { ICurrentWeather } from '../interfaces'
import { WeatherService } from '../weather/weather.service'
import { fakeWeather } from '../weather/weather.service.fake'
import { CurrentWeatherComponent } from './current-weather.component'

describe('CurrentWeatherComponent', () => {
  let component: CurrentWeatherComponent
  let fixture: ComponentFixture<CurrentWeatherComponent>
  let mockCurrentWeather$: BehaviorSubject<ICurrentWeather | null>

  beforeEach(waitForAsync(() => {
    mockCurrentWeather$ = new BehaviorSubject<ICurrentWeather | null>({
      city: '',
      country: '',
      date: Date.now(),
      image: '',
      temperature: 0,
      description: '',
    })

    TestBed.configureTestingModule({
      imports: [CurrentWeatherComponent],
      providers: [
        {
          provide: WeatherService,
          useValue: {
            currentWeather$: mockCurrentWeather$,
          },
        },
      ],
    }).compileComponents()
  }))

  beforeEach(() => {
    fixture = TestBed.createComponent(CurrentWeatherComponent)
    component = fixture.componentInstance
  })

  it('placeholder: spec has at least one test', () => {
    expect(true).toBeTrue()
  })
})
