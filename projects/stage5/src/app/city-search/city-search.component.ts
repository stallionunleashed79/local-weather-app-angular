import {
  Component,
  DestroyRef,
  EventEmitter,
  inject,
  OnInit,
  Output,
} from '@angular/core'
import { takeUntilDestroyed } from '@angular/core/rxjs-interop'
import { FormControl, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms'
import { MatFormFieldModule } from '@angular/material/form-field'
import { MatInputModule } from '@angular/material/input'
import { debounceTime, filter, tap } from 'rxjs'

import { WeatherService } from '../weather/weather.service'

@Component({
  selector: 'app-city-search',
  standalone: true,
  imports: [FormsModule, ReactiveFormsModule, MatFormFieldModule, MatInputModule],
  templateUrl: './city-search.component.html',
  styleUrls: ['./city-search.component.css'],
})
export class CitySearchComponent implements OnInit {
  search = new FormControl('', {
    nonNullable: true,
    validators: [Validators.required, Validators.minLength(2)],
  })
  @Output() searchEvent = new EventEmitter<string>()
  private destroyRef = inject(DestroyRef)

  constructor(private weatherService: WeatherService) {}

  ngOnInit(): void {
    this.search.valueChanges
      .pipe(
        takeUntilDestroyed(this.destroyRef),
        filter(() => this.search.valid),
        debounceTime(1000),
        tap((searchValue: string) => this.doSearch(searchValue)),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe()
  }

  doSearch(searchValue: string) {
    const userInput = searchValue.split(',').map((token) => token.trim())
    const searchText = userInput[0]
    const countryCode = userInput.length > 1 ? userInput[1] : undefined
    this.weatherService.updateCurrentWeather(searchText, countryCode)
  }
}
