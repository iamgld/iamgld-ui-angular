import * as components from './components'
import * as directives from './directives'
import * as guards from './guards'
import * as interceptors from './interceptors'
import * as models from './models'
import * as services from './services'
import * as stores from './stores'
import * as utils from './utils'
import * as validators from './validators'

function expectExportsDefined(namespaceLabel: string, exported: Record<string, unknown>) {
  const keys = Object.keys(exported)
  expect(keys.length).toBeGreaterThan(0)

  for (const key of keys) {
    expect(exported[key], `${namespaceLabel}.${key} should be defined`).toBeDefined()
  }
}

describe('library exports', () => {
  it('exports components', () => {
    expectExportsDefined('components', components)
  })

  it('exports directives', () => {
    expectExportsDefined('directives', directives)
  })

  it('exports guards', () => {
    expectExportsDefined('guards', guards)
  })

  it('exports interceptors', () => {
    expectExportsDefined('interceptors', interceptors)
  })

  it('exports models', () => {
    expectExportsDefined('models', models)
  })

  it('exports services', () => {
    expectExportsDefined('services', services)
  })

  it('exports stores', () => {
    expectExportsDefined('stores', stores)
  })

  it('exports utils', () => {
    expectExportsDefined('utils', utils)
  })

  it('exports validators', () => {
    expectExportsDefined('validators', validators)
  })
})
