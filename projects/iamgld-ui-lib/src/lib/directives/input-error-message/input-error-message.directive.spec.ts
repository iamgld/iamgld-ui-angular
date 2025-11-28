// Vitest Imports
import { describe, expect, test } from 'vitest'
// This Module Imports
import { InputErrorMessageDirective } from './input-error-message.directive'

describe('InputErrorMessageDirective', () => {
  test('should create an instance', () => {
    const directive = new InputErrorMessageDirective()
    expect(directive).toBeTruthy()
  })
})
