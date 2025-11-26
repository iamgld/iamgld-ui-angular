// Angular Imports
import { ReactiveFormsModule } from '@angular/forms'
// Thirdparty Imports
import { createComponentFactory, Spectator } from '@ngneat/spectator/jest'
// This Component Imports
import { TableSearchComponent } from './table-search.component'

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
