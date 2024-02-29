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
import { FC, PropsWithChildren } from 'react';
import { ComposerMode, DataExchangeFormat, ViewNavigationEvent } from '../../customTypes';
import GlobalSetupContextProvider from '../GlobalSetupContext';
import RecommendationsContext from '../RecommendationsContext';
import WorkspaceContextAggregator from '../WorkspaceContextAggregator';
import WorkspaceExamplesContext from '../WorkspaceExamplesContext';
import WorkspacesContextProvider, { WorkspacesContextProviderProps } from '../WorkspacesContext';

export interface ContextAggregatorProps extends ViewNavigationEvent {
  composerMode?: ComposerMode;
  features?: string[];
  onWorkspaceChanged?: WorkspacesContextProviderProps['onWorkspaceChanged'];
  onPreview?: (content: DataExchangeFormat) => void;
  onPreviewClose?: () => void;
  onImported?: () => void;
  onDefineWorkload?: () => void;
}

const ContextAggregator: FC<PropsWithChildren<ContextAggregatorProps>> = ({
  children,
  onWorkspaceChanged,
  composerMode = 'Full',
  features,
  onPreview,
  onPreviewClose,
  onImported,
  onDefineWorkload,
  ...props
}) => {
  return (
    <GlobalSetupContextProvider
      onPreview={onPreview}
      onPreviewClose={onPreviewClose}
      onImported={onImported}
      features={features}
      onDefineWorkload={onDefineWorkload}
      composerMode={composerMode}>
      <WorkspaceExamplesContext>
        <RecommendationsContext>
          <WorkspacesContextProvider onWorkspaceChanged={onWorkspaceChanged} {...props}>
            {(workspaceId) => (<WorkspaceContextAggregator
              workspaceId={workspaceId}
              requiredGlobalSetupContext={false}
              onThreatEditorView={props.onThreatEditorView}
              onThreatListView={props.onThreatListView}
            >
              {children}
            </WorkspaceContextAggregator>)}
          </WorkspacesContextProvider>
        </RecommendationsContext>
      </WorkspaceExamplesContext>
    </GlobalSetupContextProvider >);
};

export default ContextAggregator;