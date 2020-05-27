/**
 * @license
 * Copyright 2020 Dynatrace LLC
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import { Injectable } from '@angular/core';
import {
  Router,
  ActivatedRouteSnapshot,
  ActivationStart,
} from '@angular/router';
import { userPrefersDarkTheme } from '../../utils/theme';
import { filter } from 'rxjs/operators';

export const defaultThemeResolver = () =>
  userPrefersDarkTheme() ? 'abyss' : 'surface';

@Injectable()
export class AppThemeService {
  private _currentTheme: string;
  private _currentRoute: ActivatedRouteSnapshot;

  constructor(private _router: Router) {}

  initialize(): void {
    this._router.events
      .pipe(filter((event) => event instanceof ActivationStart))
      .subscribe((event: ActivationStart) => {
        this._currentRoute = event.snapshot;
        this._updateTheme();
      });

    if (window.matchMedia) {
      window
        .matchMedia('(prefers-color-scheme: dark)')
        .addEventListener('change', () => {
          this._updateTheme();
        });
    }
  }

  /** @internal sets a global theme on the body */
  private _updateTheme(): void {
    const theme = this._resolveTheme();
    if (theme === this._currentTheme) {
      return;
    }

    this._currentTheme = theme;

    const currentThemeClass = [
      ...(document.body.classList as any),
    ].find((clazz) => clazz.startsWith('fluid-theme'));
    if (currentThemeClass) {
      document.body.classList.remove(currentThemeClass);
    }

    document.body.classList.add(`fluid-theme--${theme}`);
    document.body.dispatchEvent(new Event('themechange'));
  }

  private _resolveTheme(): string {
    let route = this._currentRoute;

    let themeResolver: (snapshot: ActivatedRouteSnapshot) => string;
    do {
      themeResolver = route.data?.themeResolver;
      route = route.root;
    } while (!themeResolver && route.root !== route);

    if (!themeResolver) {
      themeResolver = defaultThemeResolver;
    }

    return themeResolver(this._currentRoute);
  }
}
