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
import Alert from '@cloudscape-design/components/alert';
import Box from '@cloudscape-design/components/box';
import React, { useEffect, useState } from 'react';
import { RuntimeConfigContext, RuntimeConfigContextApi } from './context';

const RuntimeConfigContextProvider: React.FC<any> = ({ children }) => {
  const [runtimeContext, setRuntimeContext] = useState<RuntimeConfigContextApi | undefined>();
  const [error, setError] = useState<string | undefined>();

  useEffect(() => {
    fetch('/runtime-config.json')
      .then((response) => {
        return response.json();
      })
      .then((runtimeCtx) => {
        setRuntimeContext(runtimeCtx as RuntimeConfigContextApi);
      })
      .catch(() => {
        setError('No runtime-config.json detected');
      });
  }, [setRuntimeContext]);

  return error ? (
    <Box padding="xl">
      <Alert statusIconAriaLabel="Error" type="error">
        {error}
      </Alert>
    </Box>
  ) : (
    <RuntimeConfigContext.Provider value={runtimeContext}>
      {children}
    </RuntimeConfigContext.Provider>
  );
};

export default RuntimeConfigContextProvider;
export * from './context';
