// Angular Imports
import { Component } from '@angular/core'
import { RouterOutlet } from '@angular/router'
// @iamgld/ui  Imports
import { ButtonComponent } from '@iamgld/ui'

@Component({
  selector: 'gld-root',
  imports: [RouterOutlet, ButtonComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {
  title = 'iamgld-ui-angular'
}
