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
// This Module Imports
import { Icons, UiTheme } from '../../models'
import { Theme } from '../../services'

export interface ThemeState {
  theme: UiTheme
  iconTheme: Icons.macLine | Icons.sunLine | Icons.moonClearLine
}

export const initialThemeState: ThemeState = {
  theme: UiTheme.system,
  iconTheme: Icons.macLine,
}

export const ThemeStore = signalStore(
  withState(initialThemeState),
  withHooks({
    onInit(store) {
      watchState(store, () => {
        // console.log('[ui-store]', state)
      })
    },
  }),
  withMethods((store, themeService = inject(Theme)) => ({
    changeTheme: ({
      theme,
      iconTheme,
    }: {
      theme: UiTheme
      iconTheme: Icons.macLine | Icons.sunLine | Icons.moonClearLine
    }): void => {
      themeService.changeTheme(theme)
      patchState(store, () => ({ theme, iconTheme }))
    },
  })),
)
