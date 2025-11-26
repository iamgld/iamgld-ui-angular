// Angular Imports
import type { Renderer2, RendererFactory2 } from '@angular/core'

export const mockRenderer: Renderer2 = {
  addClass: jest.fn(),
  removeClass: jest.fn(),
  setStyle: jest.fn(),
  removeStyle: jest.fn(),
  setProperty: jest.fn(),
  removeAttribute: jest.fn(),
  setAttribute: jest.fn(),
  listen: jest.fn(),
  destroy: jest.fn(),
  createElement: jest.fn(),
  createComment: jest.fn(),
  createText: jest.fn(),
  appendChild: jest.fn(),
  insertBefore: jest.fn(),
  removeChild: jest.fn(),
  selectRootElement: jest.fn(),
  parentNode: jest.fn(),
  nextSibling: jest.fn(),
  setValue: jest.fn(),
  destroyNode: jest.fn(),
  data: {},
}

export const mockRendererFactory: Partial<jest.Mocked<RendererFactory2>> = {
  // biome-ignore lint/suspicious/noExplicitAny: Mock type flexibility required for testing
  createRenderer: jest.fn((_hostElement: any, _type: any) => mockRenderer),
}
