/* eslint-disable @typescript-eslint/no-use-before-define */
import React, { ReactElement } from 'react';
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

const FillTypeSelector = ({
  colorSelector,
  linearGradientSelector,
  radialGradientSelector
}: FillTypeSelectorProps): ReactElement => (
  <div className='c-fill-editor__type-selector'>
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

export default FillTypeSelector;