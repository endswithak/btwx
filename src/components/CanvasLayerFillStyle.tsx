import React, { ReactElement, useEffect } from 'react';
import { connect } from 'react-redux';
import { RootState } from '../store/reducers';
import { uiPaperScope } from '../canvas';

interface CanvasLayerFillStyleProps {
  id: string;
}

interface CanvasLayerFillStyleStateProps {
  layerType: Btwx.LayerType;
  isLine: boolean;
  projectIndex: number;
  layerFrame: Btwx.Frame;
  artboardFrame: Btwx.Frame;
  fillEnabled: boolean;
  fillType: Btwx.FillType;
  fillColor: Btwx.Color;
  fillGradientType: Btwx.GradientType;
  fillGradientOrigin: Btwx.Point;
  fillGradientDestination: Btwx.Point;
  fillGradientStops: Btwx.GradientStop[];
}

const CanvasLayerFillStyle = (props: CanvasLayerFillStyleProps & CanvasLayerFillStyleStateProps): ReactElement => {
  const { id, layerType, isLine, projectIndex, layerFrame, artboardFrame, fillEnabled, fillType, fillColor, fillGradientType, fillGradientOrigin, fillGradientDestination, fillGradientStops } = props;
  // const layerItem = useSelector((state: RootState) => state.layer.present.byId[id]);
  // const layerType = useSelector((state: RootState) => state.layer.present.byId[id] && state.layer.present.byId[id].type);
  // const isLine = useSelector((state: RootState) => state.layer.present.byId[id] && state.layer.present.byId[id].type === 'Shape' && (state.layer.present.byId[id] as Btwx.Shape).shapeType === 'Line');
  // const projectIndex = useSelector((state: RootState) => state.layer.present.byId[id] && (state.layer.present.byId[state.layer.present.byId[id].artboard] as Btwx.Artboard).projectIndex);
  // // frames
  // const layerFrame = useSelector((state: RootState) => state.layer.present.byId[id] && state.layer.present.byId[id].frame);
  // const artboardFrame = useSelector((state: RootState) => state.layer.present.byId[id] && (state.layer.present.byId[state.layer.present.byId[id].artboard] as Btwx.Artboard).frame);
  // // fill
  // const fillEnabled = useSelector((state: RootState) => state.layer.present.byId[id] && state.layer.present.byId[id].style.fill.enabled);
  // const fillType = useSelector((state: RootState) => state.layer.present.byId[id] && state.layer.present.byId[id].style.fill.fillType);
  // const fillColor = useSelector((state: RootState) => state.layer.present.byId[id] && state.layer.present.byId[id].style.fill.color);
  // const fillGradientType = useSelector((state: RootState) => state.layer.present.byId[id] && state.layer.present.byId[id].style.fill.gradient.gradientType);
  // const fillGradientOrigin = useSelector((state: RootState) => state.layer.present.byId[id] && state.layer.present.byId[id].style.fill.gradient.origin);
  // const fillGradientDestination = useSelector((state: RootState) => state.layer.present.byId[id] && state.layer.present.byId[id].style.fill.gradient.destination);
  // const fillGradientStops = useSelector((state: RootState) => state.layer.present.byId[id] && state.layer.present.byId[id].style.fill.gradient.stops);

  const getStyleLayer = (): paper.Item => {
    let paperLayer = uiPaperScope.projects[projectIndex].getItem({data: {id}});
    if (paperLayer) {
      if (layerType === 'Text') {
        paperLayer = paperLayer.getItem({data: {id: 'textLines'}});
      }
      if (layerType === 'Artboard') {
        paperLayer = paperLayer.getItem({data: {id: 'artboardBackground'}});
      }
    }
    return paperLayer;
  }

  useEffect(() => {
    const paperLayer = getStyleLayer();
    if (paperLayer) {
      if (fillEnabled) {
        const layerPosition = new uiPaperScope.Point(layerFrame.x, layerFrame.y);
        const artboardPosition = new uiPaperScope.Point(artboardFrame.x, artboardFrame.y);
        const layerAbsPosition = layerPosition.add(artboardPosition);
        switch(fillType) {
          case 'color':
            paperLayer.fillColor = {
              hue: fillColor.h,
              saturation: fillColor.s,
              lightness: fillColor.l,
              alpha: fillColor.a
            } as paper.Color;
            break;
          case 'gradient':
            paperLayer.fillColor  = {
              gradient: {
                stops: fillGradientStops.reduce((result, current) => {
                  result = [
                    ...result,
                    new uiPaperScope.GradientStop({
                      hue: current.color.h,
                      saturation: current.color.s,
                      lightness: current.color.l,
                      alpha: current.color.a
                    } as paper.Color, current.position)
                  ];
                  return result;
                }, []) as paper.GradientStop[],
                radial: fillGradientType === 'radial'
              },
              origin: new uiPaperScope.Point(
                (fillGradientOrigin.x * (isLine ? layerFrame.width : layerFrame.innerWidth)) + layerAbsPosition.x,
                (fillGradientOrigin.y * (isLine ? layerFrame.height : layerFrame.innerHeight)) + layerAbsPosition.y
              ),
              destination: new uiPaperScope.Point(
                (fillGradientDestination.x * (isLine ? layerFrame.width : layerFrame.innerWidth)) + layerAbsPosition.x,
                (fillGradientDestination.y * (isLine ? layerFrame.height : layerFrame.innerHeight)) + layerAbsPosition.y
              )
            } as Btwx.PaperGradientFill;
            break;
        }
      } else {
        paperLayer.fillColor = null;
      }
    }
  }, [
      fillEnabled, fillType, fillColor, fillGradientType, fillGradientOrigin,
      fillGradientDestination, fillGradientStops, layerFrame
     ]
  );

  return (
    <></>
  );
}

const mapStateToProps = (state: RootState, ownProps: CanvasLayerFillStyleProps): CanvasLayerFillStyleStateProps => {
  const layerItem = state.layer.present.byId[ownProps.id];
  const artboardItem = layerItem ? state.layer.present.byId[layerItem.artboard] as Btwx.Artboard : null;
  const isLine = layerItem ? layerItem.type === 'Shape' && (layerItem as Btwx.Shape).shapeType === 'Line' : null;
  const layerType = layerItem ? layerItem.type : null;
  const projectIndex = layerItem ? artboardItem.projectIndex : null;
  const layerFrame = layerItem ? layerItem.frame : null;
  const artboardFrame = layerItem ? artboardItem.frame : null;
  const fillEnabled = layerItem ? layerItem.style.fill.enabled : null;
  const fillType = layerItem ? layerItem.style.fill.fillType : null;
  const fillColor = layerItem ? layerItem.style.fill.color : null;
  const fillGradientType = layerItem ? layerItem.style.fill.gradient.gradientType : null;
  const fillGradientOrigin = layerItem ? layerItem.style.fill.gradient.origin : null;
  const fillGradientDestination = layerItem ? layerItem.style.fill.gradient.destination : null;
  const fillGradientStops = layerItem ? layerItem.style.fill.gradient.stops : null;
  return {
    layerType,
    isLine,
    projectIndex,
    layerFrame,
    artboardFrame,
    fillEnabled,
    fillType,
    fillColor,
    fillGradientType,
    fillGradientOrigin,
    fillGradientDestination,
    fillGradientStops
  }
}

export default connect(
  mapStateToProps
)(CanvasLayerFillStyle);