// Vitest Imports
import { describe, expect, test } from 'vitest'
// This Module Imports
import { DropdownMenuTemplateDirective } from './dropdown-menu-template.directive'

describe('DropdownMenuTemplateDirective', () => {
  test('should create an instance', () => {
    const directive = new DropdownMenuTemplateDirective()
    expect(directive).toBeTruthy()
  })
})
