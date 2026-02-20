// Angular Imports

import { NgTemplateOutlet } from '@angular/common'
import { booleanAttribute, ChangeDetectionStrategy, Component, input, output } from '@angular/core'
import { RouterLink } from '@angular/router'
// This Module Imports
import { LinkType, LINK_TYPES, LinkAlign, LINK_ALIGNS } from '../../../models'

@Component({
	selector: 'gld-link',
	imports: [NgTemplateOutlet, RouterLink],
	templateUrl: './link.component.html',
	styleUrl: './link.component.scss',
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LinkComponent {
	id = input.required<string, string>({
		transform: (value: string) => `input-id-${value.trim().split(' ').join('-')}`,
	})
	name = input.required<string, string>({
		transform: (value: string) => `input-name-${value.trim().split(' ').join('-')}`,
	})
	redirect = input<string>('')
	active = input<boolean, boolean | string>(false, { transform: booleanAttribute })
	external = input<boolean, boolean | string>(false, { transform: booleanAttribute })
	type = input<LinkType>(LINK_TYPES.default)
	align = input<LinkAlign>(LINK_ALIGNS.center)
	clicked = output<void>()

	emitClick() {
		this.clicked.emit()
	}

	keyup() {
		this.emitClick()
	}
}
