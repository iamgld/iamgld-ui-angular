// This Component Imports

// Thirdparty Imports
import { createComponentFactory, Spectator } from '@ngneat/spectator/jest'
import { TablePaginationComponent } from './table-pagination.component'

describe('TablePaginationComponent', () => {
  let spectator: Spectator<TablePaginationComponent>
  const createComponent = createComponentFactory({
    component: TablePaginationComponent,
    imports: [],
  })

  beforeEach(() => {
    spectator = createComponent({
      props: {
        pagination: {
          itemsPerPage: 10,
          maxItems: 100,
          initialPage: 1,
        },
      },
    })
  })

  test('should render the component when created', () => {
    expect(spectator).toBeTruthy()
  })
})
