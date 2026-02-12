// Angular Imports
import { booleanAttribute, ChangeDetectionStrategy, Component, input } from '@angular/core'

@Component({
  selector: 'gld-circle-loader',
  imports: [],
  templateUrl: './circle-loader.html',
  styleUrl: './circle-loader.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CircleLoader {
  loading = input<boolean, string | boolean>(false, { transform: booleanAttribute })
  background = input<boolean, string | boolean>(false, { transform: booleanAttribute })
  radius = input<boolean, string | boolean>(false, { transform: booleanAttribute })
  minHeight = input<string>('auto')
}
