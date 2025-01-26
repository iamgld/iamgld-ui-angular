// Angular Imports
import { booleanAttribute, ChangeDetectionStrategy, Component, input } from '@angular/core'
import { NgOptimizedImage } from '@angular/common'

@Component({
  selector: 'gld-image',
  standalone: true,
  imports: [NgOptimizedImage],
  templateUrl: './image.component.html',
  styleUrl: './image.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ImageComponent {
  src = input.required<string>()
  alt = input.required<string>()
  // srcset = input<string>('')
  // sizes = input<string>('')
  priority = input<boolean, boolean | string>(false, { transform: booleanAttribute })
}
