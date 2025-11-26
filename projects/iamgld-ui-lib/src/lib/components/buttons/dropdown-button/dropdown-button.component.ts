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
// This Module Imports
import { DropdownDirection, Icons, IconsSize, IconsSpace } from '../../../models'
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
  iconSize = input<keyof typeof IconsSize>(IconsSize.normal)
  iconSpace = input<keyof typeof IconsSpace>(IconsSpace.none)
  moveTopToBottom = input<number, string | number>(0, { transform: numberAttribute })
  moveLeftToRight = input<number, string | number>(0, { transform: numberAttribute })
  direction = input<keyof typeof DropdownDirection>(DropdownDirection.left)
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

