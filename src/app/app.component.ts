// Angular Imports
import { Component } from '@angular/core'
// @iamgld/ui  Imports
import { ButtonComponent } from '@iamgld/ui'

@Component({
  selector: 'gld-root',
  imports: [ButtonComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {
  title = 'iamgld-ui-angular'
}
