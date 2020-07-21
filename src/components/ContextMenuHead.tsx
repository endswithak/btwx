import React, { useRef, useContext, useEffect, ReactElement, useState } from 'react';
import { ThemeContext } from './ThemeProvider';
import styled from 'styled-components';

interface ContextMenuHeadProps {
  text: string;
}

const Head = styled.div`
  color: ${props => props.theme.text.lighter};
`;

const ContextMenuHead = (props: ContextMenuHeadProps): ReactElement => {
  const theme = useContext(ThemeContext);
  const { text } = props;

  return (
    <Head
      className='c-context-menu__head'
      theme={theme}>
      {text}
    </Head>
  );
}

export default ContextMenuHead;