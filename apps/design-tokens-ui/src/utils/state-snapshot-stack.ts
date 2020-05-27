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

import { cloneDeep, isEqual } from 'lodash-es';
import { BehaviorSubject, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

export class StateSnapshotStack<T> {
  private _states: T[];

  private _destroy$ = new Subject<void>();

  constructor(private _stateChangeSubject: BehaviorSubject<T>) {
    this._states = [_stateChangeSubject.getValue()];
    _stateChangeSubject
      .pipe(takeUntil(this._destroy$))
      .subscribe(
        (newState) => (this._states[this._states.length - 1] = newState),
      );
  }

  pushState(): void {
    this._states.push(cloneDeep(this._states[this._states.length - 1]));
    this._stateChangeSubject.next(this._currentState);
  }

  checkStateModified(propertySelector: (state: T) => Object): boolean {
    if (this._states.length <= 1) {
      return false;
    }

    return !isEqual(
      propertySelector(this._states[this._states.length - 2]),
      propertySelector(this._currentState),
    );
  }

  commitState(): void {
    if (this._states.length < 2) {
      throw new Error('Not enough states on the stack.');
    }
    const currentState = this._states.pop()!;
    this._states[this._states.length - 1] = currentState;
    this._stateChangeSubject.next(this._currentState);
  }

  revertState(): void {
    if (this._states.length >= 2) {
      this._states.pop();
      this._stateChangeSubject.next(this._currentState);
    }
  }

  dispose(): void {
    this._destroy$.next();
    this._destroy$.complete();
  }

  private get _currentState(): T {
    return this._states[this._states.length - 1];
  }
}
