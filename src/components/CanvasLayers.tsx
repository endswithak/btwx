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
        layers.map((id, index) => (
          <CanvasLayer
            key={index}
            id={id} />
        ))
      }
    </>
  )
};

export default CanvasLayers;
// import React, { ReactElement } from 'react';
// import CanvasArtboardLayers from './CanvasArtboardLayers';
// import CanvasGroupLayers from './CanvasGroupLayers';
// import CanvasTextLayers from './CanvasTextLayers';
// import CanvasImageLayers from './CanvasImageLayers';
// import CanvasShapeLayers from './CanvasShapeLayers';

// const CanvasLayers = (): ReactElement => (
//   <>
//     <CanvasArtboardLayers />
//     <CanvasGroupLayers />
//     <CanvasTextLayers />
//     <CanvasImageLayers />
//     <CanvasShapeLayers />
//   </>
// );

// export default CanvasLayers;