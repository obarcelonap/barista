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

import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { DtCheckboxModule } from '@dynatrace/barista-components/checkbox';
import { DtDrawerModule } from '@dynatrace/barista-components/drawer';
import { DtFilterFieldModule } from '@dynatrace/barista-components/filter-field';
import { DtRadioModule } from '@dynatrace/barista-components/radio';
import {
  DtQuickFilterSubTitle,
  DtQuickFilterTitle,
  DtQuickFilter,
} from './quick-filter';
import { DtQuickFilterGroup } from './quick-filter-group';

const COMPONENTS = [DtQuickFilter, DtQuickFilterSubTitle, DtQuickFilterTitle];

@NgModule({
  imports: [
    CommonModule,
    DtDrawerModule,
    DtFilterFieldModule,
    DtCheckboxModule,
    DtRadioModule,
  ],
  exports: COMPONENTS,
  declarations: [...COMPONENTS, DtQuickFilterGroup],
})
export class DtQuickFilterModule {}
