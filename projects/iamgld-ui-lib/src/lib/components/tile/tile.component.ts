// Angular Imports
import { booleanAttribute, ChangeDetectionStrategy, Component, input } from '@angular/core'
// This Module Imports
import  { TILE_COLORS, type TileColor, TILE_PADDING_SIZES, type TilePaddingSize } from '../../models'

@Component({
  selector: 'gld-tile',
  imports: [],
  templateUrl: './tile.component.html',
  styleUrl: './tile.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Tile {
  color = input<TileColor>(TILE_COLORS.default)
  paddingSize = input<TilePaddingSize>(TILE_PADDING_SIZES.zero)
  background = input<boolean, boolean | string>(false, { transform: booleanAttribute })
  hover = input<boolean, boolean | string>(false, { transform: booleanAttribute })
}
