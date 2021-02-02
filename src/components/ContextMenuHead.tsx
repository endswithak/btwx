import React, { useRef, useContext, ReactElement } from 'react';
import { ThemeContext } from './ThemeProvider';
import IconButton from './IconButton';
import styled from 'styled-components';

interface ContextMenuHeadProps {
  text: string;
  backButton?: boolean;
  backButtonClick?(): void;
}

const Head = styled.div`
  .c-context-menu-head__content {
    color: ${props => props.theme.text.lighter};
  }
`;

const ContextMenuHead = (props: ContextMenuHeadProps): ReactElement => {
  const theme = useContext(ThemeContext);
  const { text, backButton, backButtonClick } = props;

  return (
    <Head
      className={`c-context-menu__head ${backButton ? 'c-context-menu__head--back' : ''}`}
      theme={theme}>
      {
        backButton
        ? <IconButton
            icon='thicc-chevron-left'
            size='small'
            onClick={backButtonClick} />
        : null
      }
      <span className='c-context-menu-head__content'>{text}</span>
    </Head>
  );
}

export default ContextMenuHead;