import React, { ReactElement, useState } from 'react';
import { useSelector, connect } from 'react-redux';
import { RootState } from '../store/reducers';
import  CanvasTextLayer from './CanvasTextLayer';
import  CanvasShapeLayer from './CanvasShapeLayer';
import  CanvasImageLayer from './CanvasImageLayer';
import  CanvasArtboardLayer from './CanvasArtboardLayer';
import  CanvasGroupLayer from './CanvasGroupLayer';
import  CanvasLayerFrame from './CanvasLayerFrame';
import  CanvasLayers from './CanvasLayers';
import  CanvasLayerStyle from './CanvasLayerStyle';

interface CanvasLayerProps {
  id: string;
}

interface CanvasLayerStateProps {
  layerItem: Btwx.Layer;
  artboardItem: Btwx.Artboard;
}

const CanvasLayer = (props: CanvasLayerProps & CanvasLayerStateProps): ReactElement => {
  const { id, layerItem, artboardItem } = props;
  const [rendered, setRendered] = useState(false);
  // const layerItem = useSelector((state: RootState) => state.layer.present.byId[id]);
  // const artboardItem = useSelector((state: RootState) => state.layer.present.byId[id].type !== 'Artboard' ? state.layer.present.byId[state.layer.present.byId[id].artboard] : null);

  return (
    <>
      {
        ((): ReactElement => {
          switch(layerItem.type) {
            case 'Artboard':
              return (
                <CanvasArtboardLayer
                  id={id}
                  layerItem={layerItem as Btwx.Artboard}
                  rendered={rendered}
                  setRendered={setRendered} />
              )
            case 'Text':
              return (
                <CanvasTextLayer
                  id={id}
                  layerItem={layerItem as Btwx.Text}
                  artboardItem={artboardItem as Btwx.Artboard}
                  rendered={rendered}
                  setRendered={setRendered} />
              )
            case 'Shape':
              return (
                <CanvasShapeLayer
                  id={id}
                  layerItem={layerItem as Btwx.Shape}
                  artboardItem={artboardItem as Btwx.Artboard}
                  rendered={rendered}
                  setRendered={setRendered} />
              )
            case 'Image':
              return (
                <CanvasImageLayer
                  id={id}
                  layerItem={layerItem as Btwx.Image}
                  artboardItem={artboardItem as Btwx.Artboard}
                  rendered={rendered}
                  setRendered={setRendered} />
              )
            case 'Group':
              return (
                <CanvasGroupLayer
                  id={id}
                  layerItem={layerItem as Btwx.Group}
                  artboardItem={artboardItem as Btwx.Artboard}
                  rendered={rendered}
                  setRendered={setRendered} />
              )
          }
        })()
      }
      {
        rendered && layerItem.children && layerItem.children.length > 0
        ? <CanvasLayers
            layers={layerItem.children} />
        : null
      }
      <CanvasLayerFrame
        id={id}
        rendered={rendered}
        layerItem={layerItem as Btwx.Shape}
        artboardItem={artboardItem as Btwx.Artboard} />
      <CanvasLayerStyle
        id={id}
        rendered={rendered}
        layerItem={layerItem as Btwx.Shape}
        artboardItem={artboardItem as Btwx.Artboard} />
    </>
  );
}

const mapStateToProps = (state: RootState, ownProps: CanvasLayerProps): CanvasLayerStateProps => {
  const layerItem = state.layer.present.byId[ownProps.id];
  const artboardItem = layerItem && layerItem.type !== 'Artboard' ? state.layer.present.byId[layerItem.artboard] as Btwx.Artboard : null;
  return {
    layerItem,
    artboardItem
  }
}

export default connect(
  mapStateToProps
)(CanvasLayer);