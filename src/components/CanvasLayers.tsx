/* eslint-disable @typescript-eslint/no-use-before-define */
import React, { ReactElement } from 'react';
import CanvasLayer from './CanvasLayer';

interface CanvasLayersProps {
  layers: string[];
}

const CanvasLayers = (props: CanvasLayersProps): ReactElement => {
  const { layers } = props;

  return (
    <>
      {
        layers.map((id) => (
          <CanvasLayer
            key={id}
            id={id} />
        ))
      }
    </>
  )
};

export default CanvasLayers;