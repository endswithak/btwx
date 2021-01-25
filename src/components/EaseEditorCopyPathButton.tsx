import React, { useContext, ReactElement, useState, useEffect } from 'react';
import { remote } from 'electron';
import styled from 'styled-components';
import { ThemeContext } from './ThemeProvider';

const Button = styled.button`
  color: ${props => props.theme.palette.primary};
  :hover {
    color: ${props => props.theme.palette.primaryHover};
  }
`;

interface EaseEditorCopyPathButtonProps {
  pathData: string;
}

const EaseEditorCopyPathButton = (props: EaseEditorCopyPathButtonProps): ReactElement => {
  const { pathData } = props;
  const theme = useContext(ThemeContext);
  const [showCopied, setShowCopied] = useState(false);
  const [indicatorInterval, setIndicatorInterval] = useState(null);

  const handleClick = () => {
    remote.clipboard.writeText(pathData);
    if (indicatorInterval) {
      clearInterval(indicatorInterval);
    }
    setShowCopied(true);
    const intervalId = setInterval(() => {
      setShowCopied(false);
    }, 1000);
    setIndicatorInterval(intervalId);
  }

  useEffect(() => {
    return () => {
      clearInterval(indicatorInterval);
    }
  }, []);

  return (
    <>
      <Button
        className='c-ease-editor__copy-ease'
        theme={theme}
        onClick={handleClick}>
        Copy Path
      </Button>
      {
        showCopied
        ? <div
            className='c-ease-editor__copied-indicator'
            style={{
              color: theme.text.base
            }}>
            Copied
          </div>
        : null
      }
    </>
  );
}

export default EaseEditorCopyPathButton;