import React, { ReactElement, useState, memo } from 'react';
import { connect } from 'react-redux';
import { RootState } from '../store/reducers';
import  CanvasMaskableLayer from './CanvasMaskableLayer';
import  CanvasArtboardLayer from './CanvasArtboardLayer';
import  CanvasLayerFrame from './CanvasLayerFrame';
import  CanvasLayerTransform from './CanvasLayerTransform';
import  CanvasLayers from './CanvasLayers';
import  CanvasLayerStyle from './CanvasLayerStyle';
import  CanvasLayerTextStyle from './CanvasLayerTextStyle';

interface CanvasLayerProps {
  id: string;
}

interface CanvasLayerStateProps {
  layerItem: Btwx.Layer;
  layerIndex: number;
  artboardItem: Btwx.Artboard;
  underlyingMaskIndex: number;
}

const CanvasLayer = (props: CanvasLayerProps & CanvasLayerStateProps): ReactElement => {
  const { id, layerItem, underlyingMaskIndex } = props;
  const [rendered, setRendered] = useState(false);

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
            case 'Shape':
            case 'Image':
            case 'Group':
              return (
                <CanvasMaskableLayer
                  {...props}
                  layerItem={layerItem as Btwx.MaskableLayer}
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
      {
        layerItem.type !== 'Group'
        ? <>
            <CanvasLayerTransform
              {...props}
              rendered={rendered} />
            <CanvasLayerFrame
              {...props}
              rendered={rendered} />
            <CanvasLayerStyle
              {...props}
              rendered={rendered} />
          </>
        : null
      }
      {
        layerItem.type === 'Text'
        ? <CanvasLayerTextStyle
            {...props}
            layerItem={layerItem as Btwx.Text}
            rendered={rendered} />
        : null
      }
    </>
  );
}

// useSelector makes this super laggy
const mapStateToProps = (state: RootState, ownProps: CanvasLayerProps): CanvasLayerStateProps => {
  const layerItem = state.layer.present.byId[ownProps.id];
  const parentItem = layerItem ? state.layer.present.byId[layerItem.parent] : null;
  const layerIndex = layerItem ? parentItem.children.indexOf(ownProps.id) : null;
  const underlyingMask = layerItem && layerItem.type !== 'Artboard' ? (layerItem as Btwx.MaskableLayer).underlyingMask : null;
  const underlyingMaskIndex = underlyingMask ? parentItem.children.indexOf(underlyingMask) : null;
  const artboardItem = layerItem && layerItem.type !== 'Artboard' ? state.layer.present.byId[layerItem.artboard] as Btwx.Artboard : null;
  return {
    layerItem,
    layerIndex,
    artboardItem,
    underlyingMaskIndex
  }
}

export default connect(
  mapStateToProps
)(memo(CanvasLayer));