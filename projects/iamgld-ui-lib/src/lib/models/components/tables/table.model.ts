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
  // eslint-disable-next-line no-unused-vars
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
  // eslint-disable-next-line no-unused-vars
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
  // eslint-disable-next-line no-unused-vars
  showWhen: (dataStructure: unknown) => boolean
}

export const TABLE_COLUMN_ACTION_TYPES = {
  show: 'show',
  open: 'open',
  update: 'update',
  delete: 'delete',
} as const;

export type TableColumnActionType = typeof TABLE_COLUMN_ACTION_TYPES[keyof typeof TABLE_COLUMN_ACTION_TYPES];

export interface TableColumnActionOutput {
  tableColumnAction: TableColumnAction
  object: unknown
}

// Table Search
export interface TableSearchOutput {
  action: TableSearchAction
  searching: string
}

export const TABLE_SEARCH_ACTIONS = {
  searching: 'searching',
  cleared: 'cleared',
} as const;

export type TableSearchAction = typeof TABLE_SEARCH_ACTIONS[keyof typeof TABLE_SEARCH_ACTIONS];

// Table Pagination
export interface TablePaginationConfig {
  itemsPerPage: number
  initialPage: number
  maxItems: number
}
