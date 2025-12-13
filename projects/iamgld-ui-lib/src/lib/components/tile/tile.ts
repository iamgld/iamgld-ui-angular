// Angular Imports
import { booleanAttribute, ChangeDetectionStrategy, Component, input } from '@angular/core'
// This Module Imports
import { TileColor, TilePaddingSize } from '../../models'

@Component({
  selector: 'gld-tile',
  imports: [],
  templateUrl: './tile.html',
  styleUrl: './tile.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Tile {
  color = input<keyof typeof TileColor>(TileColor.default)
  paddingSize = input<keyof typeof TilePaddingSize>(TilePaddingSize.zero)
  background = input<boolean, boolean | string>(false, { transform: booleanAttribute })
  hover = input<boolean, boolean | string>(false, { transform: booleanAttribute })
}
