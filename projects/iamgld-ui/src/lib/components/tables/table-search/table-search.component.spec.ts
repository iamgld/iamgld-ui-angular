import { ComponentFixture, TestBed } from '@angular/core/testing'

import { TableSearchComponent } from './table-search.component'

describe('TableSearchComponent', () => {
  let component: TableSearchComponent
  let fixture: ComponentFixture<TableSearchComponent>

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TableSearchComponent],
    }).compileComponents()

    fixture = TestBed.createComponent(TableSearchComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
