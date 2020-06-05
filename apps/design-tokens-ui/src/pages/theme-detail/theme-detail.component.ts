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

import { Component, OnDestroy, ChangeDetectionStrategy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { Subject, Observable } from 'rxjs';
import {
  takeUntil,
  switchMap,
  filter,
  first,
  share,
  distinctUntilKeyChanged,
  debounceTime,
  distinctUntilChanged,
} from 'rxjs/operators';
import { uniq, isEqual } from 'lodash-es';

import { PaletteSourceService } from '../../services/palette';
import { getTextColorOnBackground } from '../../utils/colors';
import {
  DEFAULT_GENERATION_OPTIONS,
  Theme,
} from '@dynatrace/design-tokens-ui/shared';

@Component({
  selector: 'design-tokens-ui-palette-detail',
  templateUrl: './theme-detail.component.html',
  styleUrls: ['./theme-detail.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ThemeDetailComponent implements OnDestroy {
  /** @internal maximum contrast ratio supported by Leonardo */
  readonly _maxRatio = 21;

  /** All palettes belonging to the current theme */
  _themeName: string = '';

  /** All palettes belonging to the current theme */
  _theme$: Observable<Theme>;

  /** @internal the user must click the delete button twice to confirm */
  _showDeletePaletteConfirmation = false;

  /** @internal Enable or disable gaps in the preview */
  _showGaps = false;

  private _destroy$ = new Subject<void>();

  constructor(
    private _paletteSourceService: PaletteSourceService,
    private _router: Router,
    route: ActivatedRoute,
  ) {
    this._theme$ = route.params.pipe(
      switchMap((params) => _paletteSourceService.getTheme(params.theme)),
      takeUntil(this._destroy$),
      filter(Boolean),
    ) as Observable<Theme>;

    this._theme$
      .pipe(share(), takeUntil(this._destroy$), distinctUntilKeyChanged('name'))
      .subscribe((theme) => {
        this._themeName = theme.name;
      });

    this._theme$
      .pipe(
        share(),
        takeUntil(this._destroy$),
        distinctUntilChanged((prev, curr) =>
          this._canSkipPaletteGeneration(prev, curr),
        ),
        debounceTime(200),
      )
      .subscribe(() => {
        this._regeneratePaletteColors();
      });

    this._theme$
      .pipe(
        share(),
        takeUntil(this._destroy$),
        distinctUntilKeyChanged('palettes'),
        debounceTime(200),
      )
      .subscribe(() => {
        this._paletteSourceService.overrideStylesForTheme(this._themeName);
      });
  }

  ngOnDestroy(): void {
    this._destroy$.next();
    this._destroy$.complete();
  }

  /** @internal */
  _createGenerationOptions(): void {
    this._paletteSourceService.modifyTheme(this._themeName, (theme) => ({
      ...theme,
      globalGenerationOptions: { ...DEFAULT_GENERATION_OPTIONS },
    }));
  }

  async _regeneratePaletteColors(): Promise<void> {
    this._theme$
      .pipe(first(), filter(Boolean))
      .subscribe(async (theme: Theme) => {
        for (const palette of theme.palettes) {
          await this._paletteSourceService.regeneratePaletteColors(
            this._themeName,
            palette.name,
            !!theme.globalGenerationOptions,
          );
        }
      });
  }

  /** @internal */
  _toggleGaps(): void {
    this._showGaps = !this._showGaps;
  }

  /** @internal */
  _getTextColorOnBackground(color: string): string {
    return getTextColorOnBackground(color);
  }

  _saveChanges(): void {
    this._paletteSourceService.applyChanges();
    this._router.navigate(['/theme']);
  }

  private _canSkipPaletteGeneration(prev: Theme, curr: Theme): boolean {
    const distinctBaseColors = (theme: Theme) =>
      uniq(theme.palettes.map((palette) => palette.tokenData.baseColor));

    return (
      prev.globalGenerationOptions === curr.globalGenerationOptions &&
      isEqual(distinctBaseColors(prev), distinctBaseColors(curr))
    );
  }
}
