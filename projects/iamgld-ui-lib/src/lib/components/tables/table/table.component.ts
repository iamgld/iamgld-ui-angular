// Angular Imports
import {
  Component,
  computed,
  input,
  booleanAttribute,
  ChangeDetectionStrategy,
  signal,
  output,
} from '@angular/core'
import { NgTemplateOutlet } from '@angular/common'
// Angular Material Imports
// import { CdkMenuModule } from '@angular/cdk/menu'
// Shared Imports
import {
  Icons,
  TableColumn,
  TableColumnAction,
  TableColumnActionOutput,
  TableColumnStructure,
  TableColumnToTableColumns,
} from '../../../models'
import {
  DropdownButtonComponent,
  DropdownMenuComponent,
  LoaderComponent,
} from '../../../components'

const components = [DropdownButtonComponent, DropdownMenuComponent, LoaderComponent]

@Component({
  selector: 'gld-table',
  standalone: true,
  imports: [NgTemplateOutlet, ...components],
  templateUrl: './table.component.html',
  styleUrl: './table.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TableComponent {
  readonly Icons = Icons

  tableColumns = input.required<TableColumn[]>()
  emptyMessage = input<string>('')
  tableHeight = input<string>('auto')
  loading = input<boolean, boolean | string>(true, { transform: booleanAttribute })
  selects = input<boolean, boolean | string>(false, { transform: booleanAttribute })
  selectsAll = input<boolean, boolean | string>(false, { transform: booleanAttribute })
  search = input<boolean, boolean | string>(false, { transform: booleanAttribute })
  pagination = input<boolean, boolean | string>(false, { transform: booleanAttribute })
  tableColumnAction = output<TableColumnActionOutput>()

  tableColumnsToShow = computed(() =>
    this.tableColumns().filter((column: TableColumn) => !column.hide),
  )
  tableColumnActions = signal<TableColumnAction[]>([])

  tableActionFunction({ tableColumnActionAsEvent, tableColumns, index }: TableActionFunction) {
    const tableColumnAction = tableColumnActionAsEvent as TableColumnAction
    const object: unknown = this.#buildObjectFromTableColumn({ tableColumns, index })
    const event: TableColumnActionOutput = {
      tableColumnAction,
      object,
    }
    this.tableColumnAction.emit(event)
  }

  changeValue(event: unknown) {
    console.log('event', event)
  }

  // We build each column and in case it doesn't exist or update it in case it already exists
  buildTableColumns<T>({
    tableColumnStructures,
    tableColumnActions,
    dataStructures,
  }: TableColumnToTableColumns): TableColumn[] {
    const tableColumns: TableColumn[] = []
    const structures = dataStructures as T[]
    this.tableColumnActions.set(tableColumnActions)

    // console.log('buildTableColumns')
    tableColumnStructures.map((column: TableColumnStructure) => {
      structures.map((dataItem: T) => {
        // We check if the property we pass it exists within the object we receive
        // eslint-disable-next-line no-prototype-builtins
        if (dataItem?.hasOwnProperty(column.name)) {
          const propertyValue = dataItem[column.name as keyof T] as T
          // We check if a column already exists in our array with the name of that property
          const currentTableColumn: TableColumn | undefined = tableColumns.find(
            (_column: TableColumn) => _column.name === column.name,
          )
          if (currentTableColumn) {
            // If it exists, we update it
            const tableColumn: TableColumn = currentTableColumn
            tableColumn.values = [...currentTableColumn.values, propertyValue]
          } else {
            // If it doesn't exist, we add it
            const tableColumnToAdd: TableColumn = {
              name: column.name,
              label: column.label,
              width: column.width ? column.width : 'auto',
              minWidth: column.minWidth ? column.minWidth : 'auto',
              maxWidth: column.maxWidth ? column.maxWidth : 'auto',
              hide: column.hide ?? false,
              template: column.template ?? undefined,
              justify: column.justify ? column.justify : 'left',
              transform:
                column.transform ?
                  column.transform
                : (value: unknown) => {
                    if (typeof value === 'string' || typeof value === 'number') return value
                    else return String(value)
                  },
              values: [propertyValue],
            }
            tableColumns.push(tableColumnToAdd)
          }
        } else {
          console.error(
            `this column "${column.name}" doesn't exist in this data structure`,
            dataStructures,
          )
        }
      })
    })

    return tableColumns
  }

  buildDataStructure({ index }: { index: number }) {
    return this.#buildObjectFromTableColumn({ tableColumns: this.tableColumns(), index })
  }

  #buildObjectFromTableColumn({ tableColumns, index }: BuildObjectFromTableColumn) {
    // We reconstruct the object passed to us from the selected index and the columns we receive

    /* INFO:
			Using this data as an input:
			index: 0
			columns = [
				{
					label: 'Id',
					name: 'id',
					values: ['333333', '222222'],
					width: '100px',
				},
				{
					label: 'Name',
					name: 'name',
					values: ['Buenos Aires', 'Mendoza'],
					width: 'auto',
				},
				{
					label: 'Chargers',
					name: 'chargers',
					values: [24, 27],
					width: '150px',
				},
				{
					label: 'Hoses',
					name: 'hoses',
					values: [23, 26],
					width: '150px',
				},
				{
					label: 'Drivers',
					name: 'drivers',
					values: [25, 29],
					width: '150px',
				},
			]

		 	We will receive this result:
			{
				chargers: 24
				drivers: 25
				hoses: 23
				id: '333333'
				name: 'Buenos Aires'
			}
		*/

    return tableColumns.reduce((previous: Partial<TableColumn>, current: TableColumn) => {
      return { ...previous, [current.name]: current.values[index] }
    }, {})
  }
}

interface TableActionFunction {
  tableColumnActionAsEvent: unknown
  tableColumns: TableColumn[]
  index: number
}

interface BuildObjectFromTableColumn {
  tableColumns: TableColumn[]
  index: number
}

