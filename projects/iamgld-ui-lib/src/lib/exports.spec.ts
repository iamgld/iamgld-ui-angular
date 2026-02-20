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
  it('Given test context, When executing, Then validates expected behavior', () => {
    expectExportsDefined('components', components)
  })

  it('Given test context, When executing, Then validates expected behavior', () => {
    expectExportsDefined('directives', directives)
  })

  it('Given test context, When executing, Then validates expected behavior', () => {
    expectExportsDefined('guards', guards)
  })

  it('Given test context, When executing, Then validates expected behavior', () => {
    expectExportsDefined('interceptors', interceptors)
  })

  it('Given test context, When executing, Then validates expected behavior', () => {
    expectExportsDefined('models', models)
  })

  it('Given test context, When executing, Then validates expected behavior', () => {
    expectExportsDefined('services', services)
  })

  it('Given test context, When executing, Then validates expected behavior', () => {
    expectExportsDefined('stores', stores)
  })

  it('Given test context, When executing, Then validates expected behavior', () => {
    expectExportsDefined('utils', utils)
  })

  it('Given test context, When executing, Then validates expected behavior', () => {
    expectExportsDefined('validators', validators)
  })
})
