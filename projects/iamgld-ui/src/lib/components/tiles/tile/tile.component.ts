// Angular Imports
import { ChangeDetectionStrategy, Component, booleanAttribute, input } from '@angular/core'
// This Module Imports
import { type TileColor } from '../../../models'

@Component({
  selector: 'gld-tile',
  standalone: true,
  imports: [],
  templateUrl: './tile.component.html',
  styleUrl: './tile.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TileComponent {
  color = input<TileColor>('blue')
  background = input<boolean, boolean | string>(false, { transform: booleanAttribute })
  padding = input<boolean, boolean | string>(false, { transform: booleanAttribute })
}
