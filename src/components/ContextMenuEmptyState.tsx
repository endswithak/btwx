import React, { useRef, useContext, useEffect, ReactElement, useState } from 'react';
import { ThemeContext } from './ThemeProvider';
import styled from 'styled-components';

interface ContextMenuEmptyStateProps {
  text: string;
}

const EmptyState = styled.div`
  color: ${props => props.theme.text.lighter};
`;

const ContextMenuEmptyState = (props: ContextMenuEmptyStateProps): ReactElement => {
  const theme = useContext(ThemeContext);
  const { text } = props;

  return (
    <EmptyState
      className='c-context-menu__empty-state'
      theme={theme}>
      {text}
    </EmptyState>
  );
}

export default ContextMenuEmptyState;