// Angular Imports

import { NgOptimizedImage } from '@angular/common'
import { booleanAttribute, ChangeDetectionStrategy, Component, input } from '@angular/core'

@Component({
  selector: 'gld-image',
  imports: [NgOptimizedImage],
  templateUrl: './image.html',
  styleUrl: './image.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Image {
  src = input.required<string>()
  alt = input.required<string>()
  // srcset = input<string>('')
  // sizes = input<string>('')
  priority = input<boolean, boolean | string>(false, { transform: booleanAttribute })
}
