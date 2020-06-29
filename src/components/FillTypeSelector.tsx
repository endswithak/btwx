/* eslint-disable @typescript-eslint/no-use-before-define */
import React, { useContext, ReactElement, useRef, useState, useEffect } from 'react';
import { ThemeContext } from './ThemeProvider';
import ColorSelector from './ColorSelector';
import LinearGradientSelector from './LinearGradientSelector';
import RadialGradientSelector from './RadialGradientSelector';

interface FillTypeSelectorProps {
  colorSelector: {
    enabled: boolean;
    onClick(): void;
    isActive: boolean;
  };
  linearGradientSelector: {
    enabled: boolean;
    onClick(): void;
    isActive: boolean;
  };
  radialGradientSelector: {
    enabled: boolean;
    onClick(): void;
    isActive: boolean;
  };
}

const FillTypeSelector = (props: FillTypeSelectorProps): ReactElement => {
  const theme = useContext(ThemeContext);
  const { colorSelector, linearGradientSelector, radialGradientSelector } = props;

  return (
    <div
      className='c-fill-editor__type-selector'
      style={{
        boxShadow: `0 -1px 0 0 ${theme.background.z4} inset`
      }}>
      {
        colorSelector.enabled
        ? <ColorSelector
            onClick={colorSelector.onClick}
            isActive={colorSelector.isActive} />
        : null
      }
      {
        linearGradientSelector.enabled
        ? <LinearGradientSelector
            onClick={linearGradientSelector.onClick}
            isActive={linearGradientSelector.isActive} />
        : null
      }
      {
        radialGradientSelector.enabled
        ? <RadialGradientSelector
            onClick={radialGradientSelector.onClick}
            isActive={radialGradientSelector.isActive} />
        : null
      }
    </div>
  );
}

export default FillTypeSelector;