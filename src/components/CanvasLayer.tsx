import React, { ReactElement, useState, memo, useEffect } from 'react';
import { connect } from 'react-redux';
import { uiPaperScope } from '../canvas';
import { RootState } from '../store/reducers';
import  CanvasTextLayer from './CanvasTextLayer';
import  CanvasShapeLayer from './CanvasShapeLayer';
import  CanvasImageLayer from './CanvasImageLayer';
import  CanvasArtboardLayer from './CanvasArtboardLayer';
import  CanvasGroupLayer from './CanvasGroupLayer';
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
}

const CanvasLayer = (props: CanvasLayerProps & CanvasLayerStateProps): ReactElement => {
  const { id, layerItem, artboardItem, layerIndex } = props;
  const scope = layerItem ? layerItem.scope : null;
  const projectIndex = layerItem ? layerItem.type === 'Artboard' ? (layerItem as Btwx.Artboard).projectIndex : artboardItem.projectIndex : null;
  const [rendered, setRendered] = useState(false);
  const [prevScope, setPrevScope] = useState(scope);

  useEffect(() => {
    const scopeLengthMatch = (prevScope && scope) && prevScope.length === scope.length;
    if (rendered && (!scopeLengthMatch || (scopeLengthMatch && !prevScope.every((s, i) => scope[i] === s)))) {
      const paperLayer = uiPaperScope.projects[projectIndex].getItem({data: {id}});
      paperLayer.data.scope = scope;
      setPrevScope(scope);
    }
  }, [scope]);

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
                  layerIndex={layerIndex}
                  artboardItem={artboardItem as Btwx.Artboard}
                  rendered={rendered}
                  setRendered={setRendered} />
              )
            case 'Shape':
              return (
                <CanvasShapeLayer
                  id={id}
                  layerItem={layerItem as Btwx.Shape}
                  layerIndex={layerIndex}
                  artboardItem={artboardItem as Btwx.Artboard}
                  rendered={rendered}
                  setRendered={setRendered} />
              )
            case 'Image':
              return (
                <CanvasImageLayer
                  id={id}
                  layerItem={layerItem as Btwx.Image}
                  layerIndex={layerIndex}
                  artboardItem={artboardItem as Btwx.Artboard}
                  rendered={rendered}
                  setRendered={setRendered} />
              )
            case 'Group':
              return (
                <CanvasGroupLayer
                  id={id}
                  layerItem={layerItem as Btwx.Group}
                  layerIndex={layerIndex}
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
  const artboardItem = layerItem && layerItem.type !== 'Artboard' ? state.layer.present.byId[layerItem.artboard] as Btwx.Artboard : null;
  return {
    layerItem,
    layerIndex,
    artboardItem
  }
}

export default connect(
  mapStateToProps
)(memo(CanvasLayer));