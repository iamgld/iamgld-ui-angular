// Angular Imports
import { Injectable, inject, type Renderer2, RendererFactory2 } from '@angular/core'
// This Module Imports
import { UiTheme } from '../../models'

@Injectable()
export class UiService {
  private readonly rendererFactory = inject(RendererFactory2)

  private renderer: Renderer2
  private allThemes: UiTheme[] = [UiTheme.dark, UiTheme.light, UiTheme.system]

  constructor() {
    this.renderer = this.rendererFactory.createRenderer(null, null)
  }

  public changeTheme(theme: UiTheme): void {
    if (document && document.body) {
      // Remove all previous themes
      this.allThemes.map((theme: UiTheme) => this.renderer.removeClass(document.body, theme))
      // Add the new theme
      this.renderer.addClass(document.body, theme)
    }
  }
}
