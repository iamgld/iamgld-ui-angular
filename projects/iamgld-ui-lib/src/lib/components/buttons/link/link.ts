// Angular Imports

import { NgTemplateOutlet } from '@angular/common'
import { booleanAttribute, ChangeDetectionStrategy, Component, input, output } from '@angular/core'
import { RouterLink } from '@angular/router'
// This Module Imports
import { LinkAlign, LinkType } from '../../../models'

@Component({
  selector: 'gld-link',
  imports: [NgTemplateOutlet, RouterLink],
  templateUrl: './link.html',
  styleUrl: './link.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Link {
  readonly LinkType = LinkType

  id = input.required<string, string>({
    transform: (value: string) => `input-id-${value.trim().split(' ').join('-')}`,
  })
  name = input.required<string, string>({
    transform: (value: string) => `input-name-${value.trim().split(' ').join('-')}`,
  })
  redirect = input<string>('')
  active = input<boolean, boolean | string>(false, { transform: booleanAttribute })
  external = input<boolean, boolean | string>(false, { transform: booleanAttribute })
  type = input<keyof typeof LinkType>(LinkType.default)
  align = input<keyof typeof LinkAlign>(LinkAlign.center)
  clicked = output<void>()

  emitClick() {
    this.clicked.emit()
  }

  keyup() {
    this.emitClick()
  }
}
