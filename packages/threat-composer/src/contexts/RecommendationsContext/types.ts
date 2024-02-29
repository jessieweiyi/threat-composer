/** *******************************************************************************************************************
  Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.

  Licensed under the Apache License, Version 2.0 (the "License").
  You may not use this file except in compliance with the License.
  You may obtain a copy of the License at

      http://www.apache.org/licenses/LICENSE-2.0

  Unless required by applicable law or agreed to in writing, software
  distributed under the License is distributed on an "AS IS" BASIS,
  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
  See the License for the specific language governing permissions and
  limitations under the License.
 ******************************************************************************************************************** */
export interface RecommendationsContextProviderProps {}
import { PerFieldExample } from '../../customTypes';

export type PerFieldExamplesType = {
  threat_source: string[];
  prerequisites: PerFieldExample[];
  threat_action: PerFieldExample[];
  threat_impact: PerFieldExample[];
  impacted_goal: string[][];
  impacted_assets: string[];
}

export const DEFAULT_PER_FIELD_EXAMPLES = {
  threat_source: [],
  prerequisites: [],
  threat_action: [],
  threat_impact: [],
  impacted_goal: [],
  impacted_assets: [],
};