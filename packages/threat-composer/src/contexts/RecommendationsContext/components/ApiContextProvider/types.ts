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
import { v4 as uuidv4 } from 'uuid';
import { PLACEHOLDER_EXCHANGE_DATA } from '../../../../configs/data';
import { TemplateThreatStatement } from '../../../../customTypes';

export interface TempRequest {
  base64_image: string;
  num_resources: number;
}

export interface TempResponseResources {
  [resourceName: string]: {
    [threat: string]: {
      Mitigations: string[];
      STRIDE: string[];
    };
  };
}

export interface TempResponse {
  design_path: string;
  results: TempResponseResources;
}

export const covertResponse = (response: TempResponse) => {
  const threats: TemplateThreatStatement[] = [];
  Object.keys(response.results).forEach(res => {
    const resValue = response.results[res];
    Object.keys(resValue).forEach(th => {
      const value = resValue[th];
      threats.push({
        id: uuidv4(),
        numericId: -1,
        prerequisites: th,
        tags: [res],
        metadata: value.STRIDE ? [
          {
            key: 'STRIDE',
            value: value.STRIDE?.map(x => x.length > 0 ? x.charAt(0).toUpperCase() : undefined).filter(x => x) as string[],
          },
        ] : undefined,
      });
    });
  });

  return {
    ...PLACEHOLDER_EXCHANGE_DATA,
    threats,
  };
};
