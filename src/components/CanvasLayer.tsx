import React, { ReactElement, useState } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../store/reducers';
import  CanvasTextLayer from './CanvasTextLayer';
import  CanvasShapeLayer from './CanvasShapeLayer';
import  CanvasImageLayer from './CanvasImageLayer';
import  CanvasArtboardLayer from './CanvasArtboardLayer';
import  CanvasGroupLayer from './CanvasGroupLayer';
import  CanvasLayerFrame from './CanvasLayerFrame';
import  CanvasLayerStyle from './CanvasLayerStyle';

interface CanvasLayerProps {
  id: string;
}

const CanvasLayer = (props: CanvasLayerProps): ReactElement => {
  const { id } = props;
  const [rendered, setRendered] = useState(false);
  const layerType = useSelector((state: RootState) => state.layer.present.byId[id].type);

  return (
    <>
      {
        ((): ReactElement => {
          switch(layerType) {
            case 'Artboard':
              return (
                <CanvasArtboardLayer
                  id={id}
                  rendered={rendered}
                  setRendered={setRendered} />
              )
            case 'Text':
              return (
                <CanvasTextLayer
                  id={id}
                  rendered={rendered}
                  setRendered={setRendered} />
              )
            case 'Shape':
              return (
                <CanvasShapeLayer
                  id={id}
                  rendered={rendered}
                  setRendered={setRendered} />
              )
            case 'Image':
              return (
                <CanvasImageLayer
                  id={id}
                  rendered={rendered}
                  setRendered={setRendered} />
              )
            case 'Group':
              return (
                <CanvasGroupLayer
                  id={id}
                  rendered={rendered}
                  setRendered={setRendered} />
              )
          }
        })()
      }
      {/* <CanvasLayerFrame
        id={id}
        rendered={rendered} /> */}
      <CanvasLayerStyle
        id={id}
        rendered={rendered} />
    </>
  );
}

export default CanvasLayer;