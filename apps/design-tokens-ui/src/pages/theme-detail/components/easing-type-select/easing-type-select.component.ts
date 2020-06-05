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

import { Component, Output, EventEmitter, Input } from '@angular/core';
import { FluidEasingType } from '@dynatrace/shared/barista-definitions';

type EasingFunctionPreset =
  | 'invalid'
  | 'linear'
  | 'ease-in-quad'
  | 'ease-out-quad'
  | 'ease-in-out-quad'
  | 'ease-in-cubic'
  | 'ease-out-cubic'
  | 'ease-in-out-cubic'
  | 'ease-in-expo'
  | 'ease-out-expo'
  | 'ease-in-out-expo'
  | 'custom';

@Component({
  selector: 'design-tokens-ui-easing-type-select',
  templateUrl: './easing-type-select.component.html',
  styleUrls: [
    './easing-type-select.component.scss',
    '../../shared-settings-styles.scss',
  ],
})
export class EasingTypeSelectComponent {
  @Input() type: FluidEasingType = 'ease-in';
  @Input() exponent: number = 2;

  @Output() typeChange = new EventEmitter<FluidEasingType>();
  @Output() exponentChange = new EventEmitter<number>();

  _customExponent = false;

  get _presetType(): EasingFunctionPreset {
    switch (this.type) {
      case 'ease-in':
        switch (this.exponent) {
          case 1:
            return 'linear';
          case 2:
            return 'ease-in-quad';
          case 3:
            return 'ease-in-cubic';
          default:
            return 'custom';
        }

      case 'ease-out':
        switch (this.exponent) {
          case 1:
            return 'linear';
          case 2:
            return 'ease-out-quad';
          case 3:
            return 'ease-out-cubic';
          default:
            return 'invalid';
        }

      case 'ease-in-out-quad':
      case 'ease-in-out-cubic':
      case 'ease-in-expo':
      case 'ease-out-expo':
      case 'ease-in-out-expo':
        return this.type;

      default:
        return 'invalid';
    }
  }

  set _presetType(preset: EasingFunctionPreset) {
    this._customExponent = preset === 'custom';

    const [type, exponent] = this._presetToTypeAndExponent(preset);

    if (type !== this.type) {
      this.typeChange.emit(type);
      this.type = type;
    }
    if (exponent !== this.exponent) {
      this.exponentChange.emit(exponent);
      this.exponent = exponent;
    }
  }

  private _presetToTypeAndExponent(
    preset: EasingFunctionPreset,
  ): [FluidEasingType, number] {
    switch (preset) {
      case 'linear':
        return ['ease-in', 1];
      case 'ease-in-quad':
        return ['ease-in', 2];
      case 'ease-out-quad':
        return ['ease-out', 2];
      case 'ease-in-cubic':
        return ['ease-in', 3];
      case 'ease-out-cubic':
        return ['ease-out', 3];

      case 'ease-in-out-quad':
      case 'ease-in-out-cubic':
      case 'ease-in-expo':
      case 'ease-out-expo':
      case 'ease-in-out-expo':
        return [preset, this.exponent];

      case 'custom':
        return ['ease-in', 1.5];
      default:
        return [this.type, this.exponent];
    }
  }
}
