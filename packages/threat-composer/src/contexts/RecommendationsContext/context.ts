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
import { createContext, useContext } from 'react';
import { PLACEHOLDER_EXCHANGE_DATA } from '../../configs/data';
import { DataExchangeFormat } from '../../customTypes';

export interface RecommendationsContextApi {
  getThreatRecommendations: (data: DataExchangeFormat) => Promise<DataExchangeFormat>;
}

const initialState: RecommendationsContextApi = {
  getThreatRecommendations: () => Promise.resolve(PLACEHOLDER_EXCHANGE_DATA),
};

export const RecommendationsContext = createContext<RecommendationsContextApi>(initialState);

export const useRecommendationsContext = () => useContext(RecommendationsContext);