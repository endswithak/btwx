/* eslint-disable @typescript-eslint/no-use-before-define */
import React, { ReactElement } from 'react';
import CanvasLayer from './CanvasLayer';

interface CanvasLayersProps {
  layers: string[];
  paperScope: Btwx.PaperScope;
}

const CanvasLayers = (props: CanvasLayersProps): ReactElement => {
  const { layers, paperScope } = props;

  return (
    <>
      {
        layers.map((id) => (
          <CanvasLayer
            key={id}
            id={id}
            paperScope={paperScope} />
        ))
      }
    </>
  )
};

export default CanvasLayers;