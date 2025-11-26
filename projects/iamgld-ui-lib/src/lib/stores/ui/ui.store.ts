// Store Imports
import { inject } from '@angular/core'
import {
  patchState,
  signalStore,
  watchState,
  withHooks,
  withMethods,
  withState,
} from '@ngrx/signals'
// Thirdparty Imports
import { Icons, UiTheme } from '@ui/models'
import { UiService } from '@ui/services'

export interface UiState {
  theme: UiTheme
  iconTheme: Icons.macLine | Icons.sunLine | Icons.moonClearLine
}

export const initialUiState: UiState = {
  theme: UiTheme.system,
  iconTheme: Icons.macLine,
}

export const UiStore = signalStore(
  withState(initialUiState),
  withHooks({
    onInit(store) {
      watchState(store, () => {
        // console.log('[ui-store]', state)
      })
    },
  }),
  withMethods((store, uiService = inject(UiService)) => ({
    changeTheme: ({
      theme,
      iconTheme,
    }: {
      theme: UiTheme
      iconTheme: Icons.macLine | Icons.sunLine | Icons.moonClearLine
    }): void => {
      uiService.changeTheme(theme)
      patchState(store, () => ({ theme, iconTheme }))
    },
  })),
)
