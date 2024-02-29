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
/** @jsxImportSource @emotion/react */
import Box from '@cloudscape-design/components/box';
import Button from '@cloudscape-design/components/button';
import ExpandableSection from '@cloudscape-design/components/expandable-section';
import PropertyFilter, { PropertyFilterProps } from '@cloudscape-design/components/property-filter';
import SpaceBetween from '@cloudscape-design/components/space-between';
import Spinner from '@cloudscape-design/components/spinner';
import TextContent from '@cloudscape-design/components/text-content';
import { css } from '@emotion/react';
import { FC, useState, useMemo, useCallback, useImperativeHandle, forwardRef } from 'react';
import { TemplateThreatStatement } from '../../../customTypes';
import STRIDE from '../../../data/stride';
import intersectArrays from '../../../utils/intersectArrays';
import shuffle from '../../../utils/shuffle';

export interface FullExamplesProps {
  onClick: (example: TemplateThreatStatement) => void;
  threatStatementExamples: TemplateThreatStatement[];
  isLoading: boolean;
  initialExpanded?: boolean;
}

const parseToken = (statements: TemplateThreatStatement[], token: PropertyFilterProps.Token) => {
  const targetValue = token.value?.slice(0, 1).toUpperCase();
  const result: number[] = [];
  statements.forEach((st, index) => {
    if (token.propertyKey === 'STRIDE') {
      const value = st.metadata?.find(m => m.key === 'STRIDE')?.value as string[];
      if (!value && token.operator === '!=') {
        result.push(index);
      }

      if (value && token.operator === '=' && value.includes(targetValue)) {
        result.push(index);
      }

      if (token.operator !== '=' && (!value || !value.includes(targetValue))) {
        result.push(index);
      }
    } else if (!token.propertyKey && token.operator === ':') {
      if (st.statement && st.statement.toLocaleLowerCase().indexOf(token.value) >= 0) {
        result.push(index);
      }
    } else {
      result.push(index);
    }
  });

  return result;
};

const styles = {
  spinner: css({
    width: '100%',
    textAlign: 'center',
  }),
};

const FullExamples: FC<FullExamplesProps & { ref?: React.ForwardedRef<any> }> = forwardRef(({
  onClick,
  threatStatementExamples,
  isLoading,
  initialExpanded = false,
}, ref) => {
  const [expanded, setExpanded] = useState(initialExpanded);
  const [query, setQuery] = useState<PropertyFilterProps.Query>({
    tokens: [],
    operation: 'and',
  });

  useImperativeHandle(ref, () => {
    return {
      collapse() {
        setExpanded(false);
      },
    };
  }, []);

  const handleClick = useCallback((example: TemplateThreatStatement) => {
    setExpanded(false);
    onClick?.(example);
  }, [onClick]);

  const filteredThreatStatementList = useMemo(() => {
    let resultExamples = [...threatStatementExamples];
    if (query.tokens.length > 0) {
      const queryResult = query.tokens.map(t => parseToken(threatStatementExamples, t));
      let mergeResult: number[] = [];
      if (queryResult.length === 1) {
        mergeResult = queryResult[0];
      } else {
        if (query.operation === 'or') {
          mergeResult = queryResult.reduce((arr: number[], cur: number[]) => {
            const result = [...arr];
            cur.forEach(n => {
              if (!result.includes(n)) {
                result.push(n);
              }
            });
            return result;
          }, []);
        } else {
          mergeResult = intersectArrays(...queryResult);
        }
      }

      resultExamples = resultExamples.filter((_r, index) => {
        return mergeResult.includes(index);
      });
    }

    return shuffle(resultExamples);
  }, [threatStatementExamples, query]);

  const filteringOptions = useMemo(() => {
    const options: PropertyFilterProps.FilteringOption[] = [];
    options.push(...STRIDE.map(v => ({
      propertyKey: 'STRIDE',
      value: v.label,
    })));

    return options;
  }, []);

  const filteringProperties: PropertyFilterProps.FilteringProperty[] = useMemo(() => {
    return [
      {
        key: 'STRIDE',
        operators: ['=', '!='],
        propertyLabel: 'STRIDE',
        groupValuesLabel: 'STRIDE values',
      },
    ];
  }, []);

  return (
    <ExpandableSection
      headerText="Full examples"
      expanded={expanded}
      onChange={({ detail }) => setExpanded(detail.expanded)}
    >
      {isLoading ? (<Box padding='m'><div css={styles.spinner}>
        <Spinner size='large'/>
      </div></Box>) : (<Box padding='m'>
        <SpaceBetween direction='vertical' size='m'>
          <PropertyFilter
            onChange={({ detail }) => setQuery(detail)}
            query={query}
            i18nStrings={{
              filteringAriaLabel: 'your choice',
              dismissAriaLabel: 'Dismiss',
              filteringPlaceholder:
                'Filter examples by metadata or content',
              groupValuesText: 'Values',
              groupPropertiesText: 'Properties',
              operatorsText: 'Operators',
              operationAndText: 'and',
              operationOrText: 'or',
              operatorLessText: 'Less than',
              operatorLessOrEqualText: 'Less than or equal',
              operatorGreaterText: 'Greater than',
              operatorGreaterOrEqualText:
                'Greater than or equal',
              operatorContainsText: 'Contains',
              operatorDoesNotContainText: 'Does not contain',
              operatorEqualsText: 'Equals',
              operatorDoesNotEqualText: 'Does not equal',
              editTokenHeader: 'Edit filter',
              propertyText: 'Property',
              operatorText: 'Operator',
              valueText: 'Value',
              cancelActionText: 'Cancel',
              applyActionText: 'Apply',
              allPropertiesLabel: 'All properties',
              tokenLimitShowMore: 'Show more',
              tokenLimitShowFewer: 'Show fewer',
              clearFiltersText: 'Clear filters',
              removeTokenButtonAriaLabel: token =>
                `Remove token ${token.propertyKey} ${token.operator} ${token.value}`,
              enteredTextLabel: text => `Use: "${text}"`,
            }}
            countText={`${filteredThreatStatementList.length} matches`}
            expandToViewport
            filteringOptions={filteringOptions}
            filteringProperties={filteringProperties}
          />
          <TextContent>
            <ul>
              {filteredThreatStatementList.map((example, index) => (
                <li key={index}>
                  <Button onClick={() => handleClick(example)} variant='link'>
                    {example.statement}
                  </Button>
                </li>))}
            </ul>
          </TextContent>
        </SpaceBetween>
      </Box>)}
    </ExpandableSection>
  );
});

export default FullExamples;