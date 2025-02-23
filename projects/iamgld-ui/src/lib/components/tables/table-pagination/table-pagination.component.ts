// Angular Imports
import {
  Component,
  signal,
  input,
  output,
  computed,
  effect,
  ChangeDetectionStrategy,
} from '@angular/core'
// Shared Imports
// import { IconButtonComponent } from '../../../components'
import { Icons, TablePagination } from '../../../models'

@Component({
  selector: 'gld-table-pagination',
  standalone: true,
  imports: [],
  templateUrl: './table-pagination.component.html',
  styleUrl: './table-pagination.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TablePaginationComponent {
  readonly Icons = Icons

  pagination = input.required<TablePagination>()
  page = output<number>()
  changeToNext = output<number>()
  changeToPrevious = output<number>()

  currentPage = signal<number>(0)
  maxPages = computed(() => {
    if (this.pagination().itemsPerPage > this.pagination().maxItems) return 1
    else return Math.ceil(this.pagination().maxItems / this.pagination().itemsPerPage)
  })

  constructor() {
    effect(() => this.page.emit(this.currentPage()))
    effect(() => {
      const initialPage = this.pagination().initialPage
      if (initialPage) this.currentPage.set(initialPage)
    })
  }

  nextPage(): void {
    if (this.pagination().maxItems !== 0) {
      if (
        this.currentPage() !==
        Math.ceil(this.pagination().maxItems / this.pagination().itemsPerPage)
      ) {
        this.currentPage.update((previousPage) => previousPage + 1)
      }
    }
    this.changeToNext.emit(this.currentPage())
  }

  previousPage(): void {
    if (this.currentPage() === 1) {
      this.currentPage.set(1)
    } else {
      this.currentPage.update((previousPage) => previousPage - 1)
    }

    this.changeToPrevious.emit(this.currentPage())
  }
}
