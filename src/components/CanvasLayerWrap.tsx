/* eslint-disable @typescript-eslint/no-use-before-define */
import React, { useEffect, ReactElement, useState } from 'react';
import { uiPaperScope } from '../canvas';

export interface CanvasLayerProps {
  rendered?: boolean;
}

const CanvasLayerWrap = (Component: any): () => ReactElement => {
  const PaperLayer = (props: PaperLayerProps): ReactElement => {
    const { id } = props;
    const [rendered, setRendered] = useState<boolean>(false);

    return (
      <Component
        {...props}
        setRendered={setRendered}
        rendered={rendered} />
    );
  }

  return PaperLayer;
}

export default CanvasLayerWrap;