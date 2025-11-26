// Angular Imports
import { ReactiveFormsModule } from '@angular/forms'
// This Component Imports
import { TableSearchComponent } from './table-search.component'
// Thirdparty Imports
import { Spectator, createComponentFactory } from '@ngneat/spectator/jest'

describe('TableSearchComponent', () => {
  let spectator: Spectator<TableSearchComponent>
  const createComponent = createComponentFactory({
    component: TableSearchComponent,
    imports: [ReactiveFormsModule],
  })

  beforeEach(() => {
    spectator = createComponent({
      props: {},
    })
  })

  test('should render the component when created', () => {
    expect(spectator).toBeTruthy()
  })
})
