// Angular Imports
import { ChangeDetectionStrategy, Component, inject, input, output } from '@angular/core'
import { FormBuilder, ReactiveFormsModule } from '@angular/forms'
// Shared Imports
// import { IconComponent } from '../../../components'
import { Icons, TableSearchAction, TableSearchOutput } from '../../../models'
// Thirdparty Imports
import { debounceTime } from 'rxjs'

@Component({
  selector: 'gld-table-search',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './table-search.component.html',
  styleUrl: './table-search.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TableSearchComponent {
  readonly #formBuilder = inject(FormBuilder)
  readonly Icons = Icons

  placeholder = input<string>('buscar')
  width = input<string>('auto')
  debounceTime = input<number>(250)
  searching = output<TableSearchOutput>()

  control = this.#formBuilder.control('')

  constructor() {
    this.control.valueChanges
      .pipe(debounceTime(this.debounceTime()))
      .subscribe((value: string | null) => {
        const action: TableSearchAction =
          value?.length ? TableSearchAction.searching : TableSearchAction.cleared
        const searching: string = value?.length ? value : ''

        this.searching.emit({
          action,
          searching,
        })
      })
  }
}
