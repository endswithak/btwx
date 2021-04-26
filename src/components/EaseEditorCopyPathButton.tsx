import { clipboard } from 'electron';
import React, { ReactElement, useState, useEffect } from 'react';
import Button from './Button';

interface EaseEditorCopyPathButtonProps {
  pathData: string;
}

const EaseEditorCopyPathButton = (props: EaseEditorCopyPathButtonProps): ReactElement => {
  const { pathData } = props;
  const [showCopied, setShowCopied] = useState(false);
  const [indicatorInterval, setIndicatorInterval] = useState(null);

  const handleClick = () => {
    if (pathData) {
      clipboard.writeText(pathData);
      if (indicatorInterval) {
        clearInterval(indicatorInterval);
      }
      setShowCopied(true);
      const intervalId = setInterval(() => {
        setShowCopied(false);
      }, 1000);
      setIndicatorInterval(intervalId);
    }
  }

  useEffect(() => {
    return () => {
      clearInterval(indicatorInterval);
    }
  }, []);

  return (
    <div className='c-ease-editor__copy-ease'>
      <Button
        disabled={!pathData}
        size='small'
        onClick={handleClick}>
        Copy Path
      </Button>
      {
        showCopied
        ? <div className='c-ease-editor__copied-indicator'>
            Copied
          </div>
        : null
      }
    </div>
  );
}

export default EaseEditorCopyPathButton;