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
import { FC, PropsWithChildren, useCallback } from 'react';
import { TempRequest, TempResponse, convertResponse } from './types';
import { PLACEHOLDER_EXCHANGE_DATA } from '../../../../configs/data';
import { DataExchangeFormat } from '../../../../customTypes';
import { useRuntimeConfigContext } from '../../../RuntimeConfigContext';
import { RecommendationsContext } from '../../context';
import { RecommendationsContextProviderProps } from '../../types';

const RecommendationsApiContextProvider: FC<PropsWithChildren<RecommendationsContextProviderProps>> = ({
  children,
}) => {
  const runtimeConfig = useRuntimeConfigContext();

  const getThreatRecommendations = useCallback(async (workspaceData: DataExchangeFormat) => {
    if (workspaceData.architecture?.image && runtimeConfig?.apiRecommendations) {
      const request: TempRequest = {
        base64_image: workspaceData.architecture?.image,
        num_resources: 1,
      };
      const response = await fetch(runtimeConfig.apiRecommendations, {
        method: 'POST',
        body: JSON.stringify(request),
      });
      const data: TempResponse = await response.json();

      console.log('Received recommendations', data);

      const convertedData = convertResponse(data);

      console.log('Converted recommendations', convertedData);

      return convertedData;
    }

    return {
      ...PLACEHOLDER_EXCHANGE_DATA,
    };
  }, []);

  return (<RecommendationsContext.Provider value={{
    getThreatRecommendations,
  }}>{children}</RecommendationsContext.Provider>);
};

export default RecommendationsApiContextProvider;