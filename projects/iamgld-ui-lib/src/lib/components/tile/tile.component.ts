// Angular Imports
import { ChangeDetectionStrategy, Component, booleanAttribute, input } from '@angular/core'
// Shared Imports
import { TileColor, TilePaddingSize } from '@ui/models'

@Component({
  selector: 'gld-tile',
  standalone: true,
  imports: [],
  templateUrl: './tile.component.html',
  styleUrl: './tile.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TileComponent {
  color = input<keyof typeof TileColor>(TileColor.default)
  paddingSize = input<keyof typeof TilePaddingSize>(TilePaddingSize.zero)
  background = input<boolean, boolean | string>(false, { transform: booleanAttribute })
  hover = input<boolean, boolean | string>(false, { transform: booleanAttribute })
}
