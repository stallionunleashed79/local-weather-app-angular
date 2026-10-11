import { provideHttpClient } from '@angular/common/http'
import { provideHttpClientTesting } from '@angular/common/http/testing'
import { TestBed, waitForAsync } from '@angular/core/testing'
import { provideNoopAnimations } from '@angular/platform-browser/animations'
import { getNativeElementByTestId } from 'angular-unit-test-helper'
import { MockComponent, MockComponents } from 'ng-mocks'

import { AppComponent } from './app.component'
import { CitySearchComponent } from './city-search/city-search.component'
import { CurrentWeatherComponent } from './current-weather/current-weather.component'

describe('AppComponent', () => {
  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [AppComponent],
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        provideNoopAnimations(), // 👈 Safely provides animation configuration without breaking the injector
      ],
    })
      .overrideComponent(AppComponent, {
        remove: { imports: [CurrentWeatherComponent, CitySearchComponent] },
        add: {
          imports: [
            MockComponent(CurrentWeatherComponent),
            MockComponent(CitySearchComponent),
          ],
        },
      })
      .compileComponents()
  }))

  it('should create the app', () => {
    const fixture = TestBed.createComponent(AppComponent)
    const app = fixture.componentInstance
    expect(app).toBeTruthy()
  })

  it('should render title', () => {
    const fixture = TestBed.createComponent(AppComponent)
    fixture.detectChanges()
    const titleElement = getNativeElementByTestId(fixture, 'title')
    expect(titleElement.textContent).toContain('LocalCast Weather')
  })
})
