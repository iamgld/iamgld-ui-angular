// Angular Imports
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  ElementRef,
  input,
  numberAttribute,
  output,
  signal,
  viewChild,
} from '@angular/core'
import { DROPDOWN_DIRECTIONS, DropdownDirection, Icons, ICONS_SIZES, IconsSize, ICONS_SPACES, IconsSpace } from '../../../models'
// This Module Imports
import { IconComponent } from '../../icon/icon.component'

const components = [IconComponent]

@Component({
  selector: 'gld-dropdown-button',
  imports: [...components],
  templateUrl: './dropdown-button.component.html',
  styleUrl: './dropdown-button.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DropdownButtonComponent {
  value = input.required<unknown>()
  icon = input<Icons | null>(null)
  iconSize = input<IconsSize>(ICONS_SIZES.normal)
  iconSpace = input<IconsSpace>(ICONS_SPACES.none)
  moveTopToBottom = input<number, string | number>(0, { transform: numberAttribute })
  moveLeftToRight = input<number, string | number>(0, { transform: numberAttribute })
  direction = input<DropdownDirection>(DROPDOWN_DIRECTIONS.left)
  changeValue = output<unknown>()

  current = signal<unknown>(null)
  disabled = signal<boolean>(false)
  error = signal<boolean>(false)
  selected = computed(() => Boolean(this.current() === this.value()))

  buttonChild = viewChild('buttonChild', { read: ElementRef })

  select(value: unknown) {
    this.changeValue.emit(value)
    this.buttonChild()?.nativeElement.blur()
  }

  keyup(value: unknown) {
    this.select(value)
  }
}
