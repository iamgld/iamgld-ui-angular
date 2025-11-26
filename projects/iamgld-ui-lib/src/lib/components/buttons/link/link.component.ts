// Angular Imports
import { Component, ChangeDetectionStrategy, input, output, booleanAttribute } from '@angular/core'
import { NgTemplateOutlet } from '@angular/common'
import { RouterLink } from '@angular/router'
// Shared Imports
import { LinkType, LinkAlign } from '@ui/models'

@Component({
  selector: 'gld-link',
  standalone: true,
  imports: [NgTemplateOutlet, RouterLink],
  templateUrl: './link.component.html',
  styleUrl: './link.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LinkComponent {
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
