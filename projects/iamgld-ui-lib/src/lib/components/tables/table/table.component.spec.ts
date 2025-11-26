// Angular Imports
import { NgTemplateOutlet } from '@angular/common'
// This Component Imports
import { TableComponent } from './table.component'
// This Module Imports
import { DropdownButtonComponent } from '../../buttons/dropdown-button/dropdown-button.component'
import { DropdownMenuComponent } from '../../buttons/dropdown-menu/dropdown-menu.component'
import { CircleLoaderComponent } from '../../loaders/circle-loader/circle-loader.component'
// Thirdparty Imports
import { Spectator, createComponentFactory } from '@ngneat/spectator/jest'

const components = [DropdownButtonComponent, DropdownMenuComponent, CircleLoaderComponent]

describe('TableComponent', () => {
  let spectator: Spectator<TableComponent>
  const createComponent = createComponentFactory({
    component: TableComponent,
    imports: [NgTemplateOutlet, ...components],
  })

  beforeEach(() => {
    spectator = createComponent({
      props: {
        tableColumns: [
          {
            name: 'id',
            label: 'ID',
            width: '100px',
            minWidth: '80px',
            maxWidth: '120px',
            template: undefined,
            justify: 'left',
            hide: false,
            transform: (value: unknown) => String(value),
            values: [1, 2, 3],
          },
          {
            name: 'name',
            label: 'Name',
            width: '200px',
            minWidth: '150px',
            maxWidth: '250px',
            template: undefined,
            justify: 'left',
            hide: false,
            transform: (value: unknown) => String(value),
            values: ['Alice', 'Bob', 'Charlie'],
          },
        ],
      },
    })
  })

  test('should render the component when created', () => {
    expect(spectator).toBeTruthy()
  })
})
