import { Component, OnInit } from '@angular/core'
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms'
import { MatFormFieldModule } from '@angular/material/form-field'
import { MatInputModule } from '@angular/material/input'

import { WeatherService } from '../weather/weather.service'

@Component({
  selector: 'app-city-search',
  standalone: true,
  imports: [FormsModule, ReactiveFormsModule, MatFormFieldModule, MatInputModule],
  templateUrl: './city-search.component.html',
  styleUrls: ['./city-search.component.css'],
})
export class CitySearchComponent implements OnInit {
  search = new FormControl('')

  constructor(private weatherService: WeatherService) {}

  ngOnInit(): void {
    this.search.valueChanges.subscribe((value: string | null) => {
      if (value) {
        const tokens = value.split(',').map((token) => token.trim())
        const city = tokens[0]
        const country = tokens.length > 1 ? tokens[1] : undefined
        this.weatherService.getCurrentWeather(city, country).subscribe((weather) => {
          console.log('Current weather:', weather)
        })
      }
    })
  }
}
