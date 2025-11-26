// Angular Imports
import { TemplateRef } from '@angular/core'
// This Module Imports
import { Icons } from '../icon/icon.model'

// Table
export interface TableColumn {
  name: string
  label: string
  width: string
  minWidth: string
  maxWidth: string
  template: TemplateRef<unknown> | undefined
  justify: 'left' | 'center' | 'right'
  hide: boolean
  transform: (value: unknown) => string | number
  values: unknown[]
}

export interface TableColumnStructure {
  name: string
  label: string
  width?: string
  minWidth?: string
  maxWidth?: string
  template?: TemplateRef<unknown>
  justify?: 'left' | 'center' | 'right'
  hide?: boolean
  transform?: (value: unknown) => string | number
}

export interface TableColumnToTableColumns {
  tableColumnStructures: TableColumnStructure[]
  tableColumnActions: TableColumnAction[]
  dataStructures: unknown[]
}

export interface TableColumnAction {
  label: string
  icon: Icons
  type: TableColumnActionType
  showWhen: (dataStructure: unknown) => boolean
}

export enum TableColumnActionType {
  show = 'show',
  open = 'open',
  update = 'update',
  delete = 'delete',
}

export interface TableColumnActionOutput {
  tableColumnAction: TableColumnAction
  object: unknown
}

// Table Search
export interface TableSearchOutput {
  action: TableSearchAction
  searching: string
}

export enum TableSearchAction {
  searching = 'searching',
  cleared = 'cleared',
}

// Table Pagination
export interface TablePagination {
  itemsPerPage: number
  initialPage: number
  maxItems: number
}
