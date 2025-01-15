// Angular Imports
import { ChangeDetectionStrategy, Component, booleanAttribute, input } from '@angular/core'

@Component({
  standalone: true,
  selector: 'gld-loader',
  imports: [],
  templateUrl: './loader.component.html',
  styleUrl: './loader.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LoaderComponent {
  loading = input<boolean, string | boolean>(false, { transform: booleanAttribute })
  background = input<boolean, string | boolean>(false, { transform: booleanAttribute })
  radius = input<boolean, string | boolean>(false, { transform: booleanAttribute })
  minHeight = input<string>('auto')
}
