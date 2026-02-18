// Angular Imports
import { ChangeDetectionStrategy, Component, inject, input, output } from '@angular/core'
import { FormBuilder, ReactiveFormsModule } from '@angular/forms'
// Thirdparty Imports
import { debounceTime } from 'rxjs'
// This Module Imports
import { ICONS, TABLE_SEARCH_ACTIONS, TableSearchAction, TableSearchOutput } from '../../../models'

@Component({
	selector: 'gld-table-search',
	imports: [ReactiveFormsModule],
	templateUrl: './table-search.component.html',
	styleUrl: './table-search.component.scss',
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TableSearch {
	readonly #formBuilder = inject(FormBuilder)
	readonly ICONS = ICONS

	placeholder = input<string>('buscar')
	width = input<string>('auto')
	debounceTime = input<number>(250)
	searching = output<TableSearchOutput>()

	control = this.#formBuilder.control('')

	constructor() {
		this.control.valueChanges
			.pipe(debounceTime(this.debounceTime()))
			.subscribe((value: string | null) => {
				const action: TableSearchAction = value?.length
					? TABLE_SEARCH_ACTIONS.searching
					: TABLE_SEARCH_ACTIONS.cleared
				const searching: string = value?.length ? value : ''

				this.searching.emit({
					action,
					searching,
				})
			})
	}
}
