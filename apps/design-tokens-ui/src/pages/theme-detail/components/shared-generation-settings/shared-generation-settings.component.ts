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

import { Component, Input, Output, EventEmitter } from '@angular/core';
import { FluidPaletteGenerationOptions } from '@dynatrace/shared/barista-definitions';
@Component({
  selector: 'design-tokens-ui-shared-generation-settings',
  templateUrl: './shared-generation-settings.component.html',
  styleUrls: ['../../shared-settings-styles.scss'],
})
export class SharedGenerationSettingsComponent {
  @Input() options: FluidPaletteGenerationOptions;
  @Output() optionsChange = new EventEmitter<FluidPaletteGenerationOptions>();

  /** @internal */
  _optionsChanged(): void {
    this.optionsChange.emit({ ...this.options });
  }
}
