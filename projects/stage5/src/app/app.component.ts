import { Component } from '@angular/core'
import { MatCardModule } from '@angular/material/card'
import { MatToolbarModule } from '@angular/material/toolbar'
import { FlexModule } from '@ngbracket/ngx-layout/flex'

import { CitySearchComponent } from './city-search/city-search.component'
import { CurrentWeatherComponent } from './current-weather/current-weather.component'
import { ICurrentWeather } from './interfaces'
import { WeatherService } from './weather/weather.service'

@Component({
  selector: 'app-root',
  template: `
    <div>
      <mat-toolbar color="primary">
        <span data-testid="title">LocalCast Weather</span>
      </mat-toolbar>
      <div fxLayoutAlign="center">
        <app-city-search (searchEvent)="doSearch($event)"></app-city-search>
      </div>
      <div fxLayout="row">
        <div fxFlex></div>
        <mat-card appearance="outlined" fxFlex="300px">
          <mat-card-header>
            <mat-card-title>
              <div class="mat-headline-5">Current Weather</div>
            </mat-card-title>
          </mat-card-header>
          <mat-card-content>
            <app-current-weather [current]="currentWeather"></app-current-weather>
          </mat-card-content>
        </mat-card>
        <div fxFlex></div>
      </div>
    </div>
  `,
  standalone: true,
  imports: [
    FlexModule,
    CurrentWeatherComponent,
    CitySearchComponent,
    MatToolbarModule,
    MatCardModule,
  ],
})
export class AppComponent {
  currentWeather!: ICurrentWeather
  constructor(private weatherService: WeatherService) {}

  doSearch(search: string) {
    const userInput = search.split(',').map((token) => token.trim())
    const city = userInput[0]
    const country = userInput.length > 1 ? userInput[1] : undefined
    this.weatherService.getCurrentWeather(city, country).subscribe((weather) => {
      this.currentWeather = weather
    })
  }
}
