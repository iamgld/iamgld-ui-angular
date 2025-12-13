// Angular Imports
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  effect,
  input,
  output,
  signal,
} from '@angular/core'
// This Module Imports
import { Icons, TablePaginationConfig } from '../../../models'

@Component({
  selector: 'gld-table-pagination',
  imports: [],
  templateUrl: './table-pagination.html',
  styleUrl: './table-pagination.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TablePagination {
  readonly Icons = Icons

  pagination = input.required<TablePaginationConfig>()
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
